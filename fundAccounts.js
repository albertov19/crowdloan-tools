/* Fund Accounts
  Script to fund some accounts (from account.json) for testing purposes. 
  Needs the account.json file.
  Provide the Account Prefix (1 - Polkadot, 2 - Kusama, 42 - Generic Substrate)
  Provide the transfer amount
*/
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as fs from 'fs';

// Global Variables
const accountPrefix = 42;
// Balance to Transfer
const minDeposit = 1000000000000; //Do not modify unless you know what you're doing
const transferAmount = 1.1 * minDeposit;
// Account funded
const { whaleMNEMONIC } = JSON.parse(fs.readFileSync('./whale-account.json'));
// Accounts to fund
const data = JSON.parse(fs.readFileSync('./accounts.json'));

// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: accountPrefix });

// Create Provider
const wsProvider = new WsProvider('ws://localhost:9944');

const fundAccounts = async (targetAddress, whaleAccount, api) => {
  // Transfer to Account
  const unsub = await api.tx.balances
    .transfer(targetAddress, transferAmount)
    .signAndSend(whaleAccount, { nonce: -1 }, ({ status }) => {
      if (status.isFinalized) {
        console.log(
          `✔️  - Finalized at block hash #${status.asFinalized.toString()}`
        );
        unsub();
      }
    });

  // Log
  console.log(`💰 - Transfer to ${targetAddress}`);
};

const main = async () => {
  // Initialize WASM
  await cryptoWaitReady();

  // Add Whale Account
  const whaleAccount = keyring.createFromUri(whaleMNEMONIC, {
    name: 'sr25519',
    ss58Format: accountPrefix,
  });

  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Loop for Tx
  for (let i = 0; i < data.publicKeys.length; i++) {
    await fundAccounts(data.publicKeys[i], whaleAccount, api);
  }
};

main();
