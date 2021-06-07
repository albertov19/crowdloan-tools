/* Create Crowdloan
  Script to create  a Crowdloan. Parachain ID must be reserved and registered.
  Check createParachain.js file for Parachain ID reservation and Registration
  Provide the Account Prefix (1 - Polkadot, 2 - Kusama, 42 - Generic Substrate)
  Provide the reserved and registered Parachain ID
  Provide the crowdloan cap
*/
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// Global Variables
const accountPrefix = 42;
const paraID = 2000;
// Balance to Transfer
const minDeposit = 1000000000000; //Do not modify unless you know what you're doing
const crowdloanCap = 1000 * minDeposit;
// Account funded
const { whaleMNEMONIC } = JSON.parse(fs.readFileSync('./whale-account.json'));

// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519', ss58Format: accountPrefix });

// Create Provider
const wsProvider = new WsProvider('ws://localhost:9944');

const createCrowdloan = async (whaleAccount, api) => {
  // Get Current Block
  const block = (await api.query.system.number()).words[0];

  // Create Crowdloan for 50 blocks
  console.log(`🤖 - Creating Crowdloan for Parachain ${paraID}`);
  let unsub = await api.tx.crowdloan
    .create(paraID, crowdloanCap, 0, 3, block + 50, null)
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
    ss58Format: accountPrefix,
  });

  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Sign and Send Attestation
  await createCrowdloan(whaleAccount, api);
};

main();
