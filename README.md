# WalletGPT - Expense Tracker

WalletGPT is an innovative application designed to track expenses and manage your wallet efficiently. Utilizing the power of GPT, this application offers a seamless and interactive experience for managing your personal finances.

# PDFs for the video walkthrough
[part1.pdf](https://github.com/kevin36524/WalletGPT/files/13725044/part1.pdf)
[part2.pdf](https://github.com/kevin36524/WalletGPT/files/13725048/part2.pdf)
[part3.pdf](https://github.com/kevin36524/WalletGPT/files/13725047/part3.pdf)
[part4.pdf](https://github.com/kevin36524/WalletGPT/files/13725046/part4.pdf)
[part5.pdf](https://github.com/kevin36524/WalletGPT/files/13725045/part5.pdf)

## Experience WalletGPT
Try WalletGPT live at: [WalletGPT Experience](https://chat.openai.com/g/g-YsCO6x6Ad-wallet-expense-tracker)


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

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
For any queries or contributions, please reach out to us at kevin36524@gmail.com.

