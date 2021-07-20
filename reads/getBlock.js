import { ApiPromise, WsProvider } from '@polkadot/api';

// Global Variables
const paraID = 2023; // Change this for 2023 on Kusama

// Create Provider (change address to Kusama)
const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');

const main = async () => {
  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;

  // Fetch crowdloan information
  const signedBlock = await api.rpc.chain.getBlock();
  console.log(signedBlock);
};

main();
