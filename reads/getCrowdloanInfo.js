import { ApiPromise, WsProvider } from '@polkadot/api';

// Global Variables
const paraID = 2023; // Change this for 2023 on Kusama
const blockStart = 7833885;

// Create Provider (change address to Kusama)
const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');

const main = async () => {
  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Get current block hash
  const blockHash = (await api.rpc.chain.getBlockHash(blockStart)).toJSON();

  // Fetch crowdloan information
  console.log(`🤖 - Getting Crowdloan Info for ${paraID}`);
  const crowdloanInfo = (
    await (await api.query.crowdloan.funds).at(blockHash, paraID)
  ).toJSON();
  // Extract the current and cap values
  const currentRaised = parseInt(crowdloanInfo.raised);
  console.log(currentRaised / 1000000000000);
};

main();
