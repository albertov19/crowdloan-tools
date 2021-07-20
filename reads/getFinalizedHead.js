import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle } from 'moonbeam-types-bundle';

// Create Provider (change address to Kusama)
const wsProvider = new WsProvider('wss://wss.testnet.moonbeam.network/');

const main = async () => {
  // Wait for Provider
  const api = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: typesBundle,
  });
  await api.isReady;

  // Get finalized block
  const blockFinalized = (await api.rpc.chain.getFinalizedHead()).toJSON();
  console.log(blockFinalized);
};

main();
