/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {getOauth2Client} from "./firebaseUtils";


export const getAuthenticationURL = async function(req:functions.Request, resp:functions.Response) {
  if (req.method === "OPTIONS") {
    resp.send({result: "success"});
    return;
  }

  const {state, redirect_uri} = req.query;
  const newState = `${state}__redirectURI__${redirect_uri}`;
  const oAuth2Client = getOauth2Client();
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    state: newState,
    scope: "openid profile",
  });

  resp.redirect(authorizeUrl);
};

export const oauthRedirect = async function(req:functions.Request, resp:functions.Response) {
  if (req.method === "OPTIONS") {
    resp.send({result: "success"});
    return;
  }
  const {code, state} = req.query;
  const splittedState = (state as string).split("__redirectURI__");
  const newState = splittedState[0];
  const redirectUri = decodeURIComponent(splittedState[1]);

  const redirectURL = `${redirectUri}?code=${code}&state=${newState}`;
  resp.redirect(redirectURL);
};

export const getTokensFromCode = async function(req:functions.Request, resp:functions.Response) {
  const {clientId, clientSecret, code, refresh_token} = req.body;

  try {
    const oAuth2Client = getOauth2Client(clientId, clientSecret);
    if (refresh_token) {
      oAuth2Client.setCredentials({refresh_token: refresh_token});
      const tokens = await oAuth2Client.getAccessToken();
      if (tokens.res) {
        resp.status(tokens.res.status).send(tokens.res.data);
      } else {
        resp.status(500).send("Some issues");
      }
      return;
    }
    const {tokens} = await oAuth2Client.getToken(code);
    const expiryDate = tokens.expiry_date as number;

    const retObj = {...tokens, "expires_in": Math.round((expiryDate - Date.now())/1000)};

    resp.send(retObj);
  } catch (error) {
    resp.status(500).send(`Error ${(error as Error).message}`);
  }
};
