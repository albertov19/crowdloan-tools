# Tools to interact with a Crowdloan

## Get Started

Install:

```
yarn
```

## Create Accounts

Create accounts (modify the number of accounts to be created inside the file):

```
node createAccounts.js
```

This will create a `accounts.json` file with the public key and mnemonics of the created addresses

## Fund Accounts

From a whale account (mnemonic stored in `whale-account.json`), the script will fund the accounts specified in the `accounts.json`  file.

## Create Parachain

From the whale account (mnemonic stored in `whale-account.json`), the script will reserve Parachain ID and register it:

```
node createParachain.js
```

## Create Crowdloand

Before creating a Crowdloan, the parachain must be onboarded. From the whale account (mnemonic stored in `whale-account.json`), the script will create a Crowdloan (must modify the Parachain ID manually inside the file):

```
node createCrowdloan.js
```

## Fund Crowdloan

Using the accounts from the `accounts.json`, funds a Crowdloan that is already created and active:

```
node fundCrowdloan.js
```

⚠️⚠️ Use at your own risk!!!
