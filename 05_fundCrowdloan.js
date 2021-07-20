/* Fund Crowdloan
  Script to fund a crowdloan with a given Parachain ID
  It loads a set of funded accounts from the accounts.json file (check createAccounts and fundAccounts)
  Provide the Account Prefix (1 - Polkadot, 2 - Kusama, 42 - Generic Substrate)
  Provide the contribute ammount
*/
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as ethers from 'ethers';
import * as fs from 'fs';

// Global Variables
const accountPrefix = 42;
const paraID = 2002;
let ethAccounts = {};
let ethAddress = Array();
let ethMnemonic = Array();
// Balance to Transfer
const minDeposit = 1000000000000; //Do not modify unless you know what you're doing
const contributeAmount = 1 * minDeposit;
// Accounts with funds
const data = JSON.parse(fs.readFileSync('./accounts.json'));
// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: accountPrefix });

// Create Provider
const wsProvider = new WsProvider('wss://wss-relay.testnet.moonbeam.network');

const fundCrowdloan = async (api) => {
  // Loop for Tx
  for (let i = 0; i < data.mnemonics.length; i++) {
    // Add Account
    let account = keyring.createFromUri(data.mnemonics[i], {
      name: 'sr25519',
      ss58Format: accountPrefix,
    });

    // Create Ethereum account
    let ethWallet = ethers.Wallet.createRandom();
    ethMnemonic[i] = ethWallet.mnemonic.phrase;
    ethAddress[i] = ethWallet.address;

    // Create batch transactions
    const txs = [
      api.tx.crowdloan.contribute(paraID, contributeAmount, null),
      api.tx.crowdloan.addMemo(paraID, ethAddress[i]),
    ];

    // Contribute to Crowdloan and addMemo
    console.log(`🤖 - Contributing to Parachain ${paraID}`);
    let unsub = await api.tx.utility
      .batch(txs)
      .signAndSend(account, { nonce: -1 }, async ({ status }) => {
        if (status.isFinalized) {
          console.log(`✔️  - Finalized at block hash #${status.asFinalized.toString()}`);
          unsub();
        }
      });
  }

  ethAccounts.mnemonics = ethMnemonic;
  ethAccounts.publicKeys = ethAddress;

  // Save data to JSON file
  const accountsJSON = JSON.stringify(ethAccounts);
  fs.writeFileSync('ethAccounts.json', accountsJSON, 'utf-8');
};

const main = async () => {
  // Initialize WASM
  await cryptoWaitReady();

  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Sign and Send Attestation
  await fundCrowdloan(api);
};

main();
