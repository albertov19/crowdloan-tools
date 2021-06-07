# Tools to interact with a Crowdloan

## Get Started

Install:

```
yarn
```

Create accounts (modify the number of accounts to be created inside the file):

```
node createAccounts.js
```

This will create a `.json` file with the public key and mnemonics of the created addresses

## Create Parachain

Reserve Parachain ID and Register:

```
node createParachain.js
```

## Create Crowdloand

Before creating a Crowdloan, the parachain must be onboarded. Register a Crowdloan (must modify the Parachain ID manually inside the file):

```
node createCrowdloan.js
```

## Fund Crowdloan

Fund a Crowdloan that is already created and active:

```
node fundCrowdloan.js
```

⚠️⚠️ Use at your own risk!!!
