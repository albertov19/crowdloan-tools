/* Fund Crowdloan
  Script to fund a crowdloan with a given Parachain ID
  It loads a set of funded accounts from the accounts.json file (check createAccounts and fundAccounts)
  Provide the Account Prefix (1 - Polkadot, 2 - Kusama, 42 - Generic Substrate)
  Provide the contribute ammount
*/
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as fs from 'fs';

// Global Variables
const accountPrefix = 42;
const paraID = 2000;
// Balance to Transfer
const minDeposit = 1000000000000; //Do not modify unless you know what you're doing
const contributeAmount = 1 * minDeposit;
// Accounts with funds
const data = JSON.parse(fs.readFileSync('./accounts.json'));
// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: accountPrefix });

// Create Provider
const wsProvider = new WsProvider('ws://localhost:9944');

const fundCrowdloan = async (api) => {
  // Loop for Tx
  for (let i = 0; i < data.mnemonics.length; i++) {
    // Add Account
    let account = keyring.createFromUri(data.mnemonics[i], {
      name: 'sr25519',
      ss58Format: accountPrefix,
    });

    // Contribute to Crowdloan
    console.log(`🤖 - Contributing to Parachain ${paraID}`);
    let unsub = await api.tx.crowdloan
      .contribute(paraID, contributeAmount, null)
      .signAndSend(account, { nonce: -1 }, async ({ status }) => {
        if (status.isFinalized) {
          console.log(
            `✔️  - Finalized at block hash #${status.asFinalized.toString()}`
          );
          unsub();
        }
      });
  }
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
