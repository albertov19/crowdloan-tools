import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('./accounts.json'));

// Global Variables
const paraID = 2000;
// Balance to Transfer
const minDeposit = 1000000000000;
const contributeAmount = (100 * minDeposit) / 2;
// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

// Create Provider
const wsProvider = new WsProvider('ws://localhost:9944');

const fundCrowdloan = async (api) => {
  // Loop for Tx
  for (let i = 0; i < data.mnemonics.length; i++) {
    // Add Account
    let account = keyring.createFromUri(data.mnemonics[i], {
      name: 'sr25519',
      ss58Format: 2,
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
