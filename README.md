# WalletGPT - Expense Tracker

WalletGPT is an innovative application designed to track expenses and manage your wallet efficiently. Utilizing the power of GPT, this application offers a seamless and interactive experience for managing your personal finances.

## Experience WalletGPT
Try WalletGPT live at: [WalletGPT Experience](https://chat.openai.com/g/g-YsCO6x6Ad-wallet-expense-tracker)

# Video Walkthrough and instructions

- [Part 1 - Intros to GPT](https://youtu.be/xFygDFqzG-U)
- [Part 2 - Walkthrough](https://youtu.be/yNESy1QgLoU)
- [Part 3 - Technical Architectural Overview](https://youtu.be/iJNq8iLX1iw)
- [Part 4 - Building our service on Firebase](https://youtu.be/DvRaepP4eCw)
- [Part 5 - Creating GPT and hooking it to our Service](https://youtu.be/-f-PnfsQTJw)

# Requirements

- [Google cloud account](https://cloud.google.com)
- [An editor (I am using VSCode0](https://code.visualstudio.com/)
- [NodeJS](https://nodejs.org/en/download)
- [Typescript](https://www.typescriptlang.org/download)
- [Firebase-tools](https://firebase.google.com/docs/cli)
- [Chat GPT Plus Subscription]()

# Instructions

## Deployment on Firebase instructions 
Here are the high-level instructions. Please refer to [Part 4 - Building our service on Firebase](https://youtu.be/DvRaepP4eCw) for more details

### Create Firebase project

- On Terminal
    - `firebase logout; firebase login` → choose your gcloud account that you would like to use.
    - `firebase init`
       - choose hosting and functions
       - Create a new project
       - Lang - Typescript
       - Hit enter for everything else
- Browse to [Firebase Console](console.firebase.google.com)
    - Choose your project
    - Tap on `Modify` plan on the bottom left of the overview page and switch to `Blaze plan`
    - Add authentication with Google
    - Create firestore database

### Get the code

- Clone `git clone https://github.com/kevin36524/WalletGPT` into a separate folder
    - Now replace your functions directory with the functions from this newly cloned repo.
      - Something like this `rm -rf myProject/functions; cp -r WalletGPT/functions myProject/.`
    - Now you can safely discard your cloned repo. `rm -rf WalletGPT`
- run `npm install` in your fucntions directory, not on the cloned Repo
- Update .env.local vars
    - Go to [APIs and Services](https://console.cloud.google.com/apis/credentials) in google cloud.
    - You should see your OAuth 2.0 client-id open that
       - Update your authorized Redirect URIs and add
          - https://<your_cloud_function_base_URL>/oauthRedirect
    - Now update your .env.local vars with
       - clientID, clientSecret and your authorized Redirect URI you see above.
    - Now copy the .env.local to .env.default
- Run `npm run deploy`
- Test with [testRequests.http](functions/reference_stuff/testRequests.http).
    - Replace the base URL and test it out.

## Creating the GPT and hooking it up with your cloud functions.
Here are the high-level instructions. Please refer to [Part 5 - youtube video](https://youtu.be/-f-PnfsQTJw) for more details

### Create a GPT

- Login to your chatgpt plus account.
- Next go to [https://chat.openai.com/create](https://chat.openai.com/create)
    - Write a GPT to help me keep a journal for my expences and income.
       I would like to call it something like wallet journal
    - It will also generate a profile photo for you.
- Now go to configure
    - Change the conversation starters to something more relevant like
       - What is my wallet balance?
       - Log an expense of 10 dollars at walmart for groceries
       - Add 100 dollars as pocket money to my wallet
       - Give me my most recent transactions
       - Reset my wallet


### Configure Actions for your GPT

- Hit create new Action
- Authentication choose OAuth
    - Add your `client-id`, `client-secret` from your .env.default file
    - Add authorizationURL:
       `https://<your_cloudfunctions_base_url>/getAuthenticationURL`
    - Add tokenURL:
       `https://<your_cloudfunctions_base_url>/getTokensFromCode`
- Copy the contents of [schema.json](functions/reference_stuff/schema.json) and paste in the schema section
    - Replace `servers[0].url` to your cloudfunction base URL.
    - This schema tells GPT about all the available functionalities.
- Publish - only to me
    - Now you will be able to try out the GPT




## Features
- **Get Wallet Balance:** Retrieve the current balance in your wallet.
- **Reset Wallet:** Clear all transaction records and reset your wallet amount.
- **Get Latest Transactions:** View the most recent transactions in your wallet.
- **Add Income:** Record new income transactions to your wallet.
- **Add Expense:** Log new expenses and deduct them from your wallet balance.

## API Reference
WalletGPT's functionalities are accessible via a RESTful API, hosted at `https://us-central1-wallet-gpt-924f1.cloudfunctions.net`. The API follows the OpenAPI 3.0.0 specification.

### Endpoints
- All endpoints need authorization header

- `/getWalletBalance`
  - **Method:** GET
  - **Description:** Get the current money in the wallet.
- `/resetWallet`
  - **Method:** GET
  - **Description:** Remove all transaction records and reset the wallet amount.
- `/getLatestTransactions`
  - **Method:** GET
  - **Description:** Get the latest transactions in the wallet.
- `/addIncomeToWallet`
  - **Method:** POST
  - **Parameters:**
    - `amount`: (number) Amount to be added.
    - `description`: (string) Note for the income.
  - **Description:** Add a credit transaction record.
- `/addExpenseToWallet`
  - **Method:** POST
  - **Parameters:**
    - `amount`: (number) Amount to be subtracted.
    - `description`: (string) Note for the expense.
  - **Description:** Add a debit transaction record.

- If you want more info check out the [testRequests.http](reference_stuff/testRequests.http)

## License
This project is licensed under the MIT License.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## Contact
For any queries or contributions, please reach out to us at kevin36524@gmail.com.
