import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('./accounts.json'));

// Global Variables
let paraID;
// Account funded
const { whaleMNEMONIC } = JSON.parse(fs.readFileSync('./whale-account.json'));

// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

// Create Provider
const wsProvider = new WsProvider('ws://localhost:9944');

const reservePara = async (whaleAccount, api) => {
  // Reserve Parachain ID
  console.log(`🤖 - Reserving Parachain ID`);
  let unsub = await api.tx.registrar
    .reserve()
    .signAndSend(whaleAccount, { nonce: -1 }, async ({ status }) => {
      if (status.isFinalized) {
        console.log(
          `✔️  - Finalized at block hash #${status.asFinalized.toString()} \n`
        );
        await registerPara(whaleAccount, api);
        unsub();
      }
    });
};

const registerPara = async (whaleAccount, api) => {
  // Register Parachain
  console.log(`🤖 - Registering Parachain`);
  let unsub = await api.tx.registrar
    .register(paraID, '0x11', '0x11')
    .signAndSend(whaleAccount, { nonce: -1 }, async ({ status }) => {
      if (status.isFinalized) {
        console.log(
          `✔️  - Finalized at block hash #${status.asFinalized.toString()} \n`
        );
        unsub();
      }
    });
};

const main = async () => {
  // Initialize WASM
  await cryptoWaitReady();

  // Add Whale Account
  const whaleAccount = keyring.createFromUri(whaleMNEMONIC, {
    name: 'sr25519',
    ss58Format: 2,
  });

  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Get Next ParaID
  paraID = (await api.query.registrar.nextFreeParaId()).words[0];
  console.log(` ℹ - Next Parachain ID is ${paraID}`);

  // Reserve Parachain will trigger the chain of events
  await reservePara(whaleAccount, api);
};

main();
