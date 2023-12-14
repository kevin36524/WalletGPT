/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as authService from "./AuthService";
import * as walletService from "./WalletService";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const getAuthenticationURL = functions.https.onRequest(authService.getAuthenticationURL);
export const oauthRedirect = functions.https.onRequest(authService.oauthRedirect);
export const getTokensFromCode = functions.https.onRequest(authService.getTokensFromCode);

export const addIncomeToWallet = functions.https.onRequest(walletService.addIncomeToWallet);
export const addExpenseToWallet = functions.https.onRequest(walletService.addExpenseToWallet);
export const resetWallet = functions.https.onRequest(walletService.resetWallet);
export const getWalletBalance = functions.https.onRequest(walletService.getWalletBalance);
export const getLatestTransactions = functions.https.onRequest(walletService.getLatestTransactions);
