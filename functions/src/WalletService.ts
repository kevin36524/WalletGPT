/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as firebaseUtils from "./firebaseUtils";
import * as admin from "firebase-admin";

export type UserWallet = {
    id: string;
    amount: number;
};

export type Trasaction = {
    amount: number;
    description: string;
    id: string;
    ts: number;
}

const addTransaction = async (userId: string, amount: number, ts: number, description: string) => {
  // Create a Firestore batch to perform atomic writes
  const batch = firebaseUtils.store.batch();

  // Reference to the transaction document
  const transactionCollection = firebaseUtils.store.collection(`users/${userId}/transactions`);
  const transactionDoc = transactionCollection.doc();

  // Reference to the user document
  const userDoc = firebaseUtils.store.doc(`users/${userId}`);
  const userDocSnapShot = await userDoc.get();

  const userExist = userDocSnapShot.exists;

  // Add the transaction data to the batch
  batch.set(transactionDoc, {
    amount,
    ts,
    description,
    id: transactionDoc.id,
  });

  // Update the user document in the batch
  const userUpdateObj = {
    amount: admin.firestore.FieldValue.increment(amount),
    id: userId,
  };

  if (userExist) {
    batch.update(userDoc, userUpdateObj);
  } else {
    batch.set(userDoc, userUpdateObj);
  }

  // Commit the batch to Firestore
  await batch.commit();
};

export const addIncomeToWallet = async (request: functions.Request, response: functions.Response) => {
  const user = await firebaseUtils.commonRequestHandler(request, response);
  functions.logger.info(`Got the response ${JSON.stringify(user)}`);
  const {amount, description} = request.body;
  if (!user) {
    response.status(500).send("Could not locate user");
    return;
  }

  try {
    await addTransaction(user.sub, amount, Date.now(), description);
  } catch (error) {
    functions.logger.error(`Error ${(error as Error).message}`);
    response.status(500).send("Some issues");
  }
  response.send("Success");
};


export const addExpenseToWallet = async (request: functions.Request, response: functions.Response) => {
  const user = await firebaseUtils.commonRequestHandler(request, response);
  const {amount, description} = request.body;
  if (!user) {
    response.status(500).send("Could not locate user");
    return;
  }

  try {
    await addTransaction(user.sub, amount * -1, Date.now(), description);
  } catch (error) {
    functions.logger.error(`Error ${(error as Error).message}`);
    response.status(500).send("Some issues");
  }
  response.send("Success");
};

export const resetWallet = async (request:functions.Request, response: functions.Response) => {
  const user = await firebaseUtils.commonRequestHandler(request, response);

  if (!user) {
    response.status(500).send("Could not locate user");
    return;
  }

  const userId = user.sub;

  const userDoc = firebaseUtils.store.doc(`users/${userId}`);

  try {
    await firebaseUtils.store.recursiveDelete(userDoc);
    // await userDoc.delete();
  } catch (error) {
    functions.logger.error(`Error ${(error as Error).message}`);
    response.status(500).send("Some issues");
  }
  response.send("Success");
};

export const getWalletBalance = async (request: functions.Request, response: functions.Response) => {
  const user = await firebaseUtils.commonRequestHandler(request, response);

  if (!user) {
    response.status(500).send("Could not locate user");
    return;
  }

  const userId = user.sub;
  const userDoc = firebaseUtils.store.doc(`users/${userId}`);

  try {
    const userDocSnapShot = await userDoc.get();
    if (!userDocSnapShot.exists) {
      response.send({balance: 0});
    }
    const userData = userDocSnapShot.data() as UserWallet;
    response.send({balance: (Math.round(userData.amount * 100)/100)});
  } catch (error) {
    functions.logger.error(`Error ${(error as Error).message}`);
    response.status(500).send("Some issues");
  }
};

export const getLatestTransactions = async (request: functions.Request, response: functions.Response) => {
  const user = await firebaseUtils.commonRequestHandler(request, response);

  if (!user) {
    response.status(500).send("Could not locate user");
    return;
  }

  const userId = user.sub;
  try {
    const transactionsCollectionRef = firebaseUtils.store.collection(`users/${userId}/transactions`);
    const querySnapshot = await transactionsCollectionRef.orderBy("ts", "desc").limit(10).get();
    const docs = querySnapshot.docs;

    const transactions = docs.map((doc) => doc.data() as Trasaction).map((transaction) => {
      return {
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(transaction.ts),
      };
    });

    response.status(200).send({transactions});
  } catch (error) {
    functions.logger.error(`Error ${(error as Error).message}`);
    response.status(500).send("Some issues");
  }
};
