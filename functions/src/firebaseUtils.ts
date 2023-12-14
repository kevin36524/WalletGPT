/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {OAuth2Client} from "google-auth-library";

export type UserProfileData = {
    family_name: string;
    given_name: string;
    locale: string;
    name: string;
    picture: string;
    sub: string;
};

export const getOauth2Client = function(clientID:string|null = null, clientSecret:string|null = null, redirectURI:string|null = null) {
  const config = functions.config().google_oauth;
  const client_id = clientID || config.client_id;
  const client_secret = clientSecret || config.client_secret;
  const redirect_uri = redirectURI || config.redirect_uri;

  const oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      redirect_uri
  );
  return oAuth2Client;
};

admin.initializeApp();

export const store = admin.firestore();

const userFromRequest = async (request:functions.Request) => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    throw (Error("Missing Authorization Headers"));
  }
  const accessToken = authorizationHeader.split("Bearer ")[1];

  const oAuth2Client = getOauth2Client();
  oAuth2Client.setCredentials({access_token: accessToken});

  // Make a request to the Google API to retrieve the user's profile information.
  const userinfo = await oAuth2Client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });

  functions.logger.info(JSON.stringify(userinfo.data));

  return userinfo.data as UserProfileData;
};

const addCorsHeader = (request:functions.Request, response: functions.Response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  if (request.method === "OPTIONS") {
    response.send({result: "success"});
    return false;
  }

  return true;
};

export const commonRequestHandler = async (request:functions.Request, response: functions.Response) => {
  const shouldProcess = addCorsHeader(request, response);
  if (!shouldProcess) {
    return;
  }

  try {
    const user = await userFromRequest(request);
    return user;
  } catch (error) {
    functions.logger.error(`error: ${(error as Error).message}`);
    response.status(401).send({"error": (error as Error).message});
    return;
  }
};
