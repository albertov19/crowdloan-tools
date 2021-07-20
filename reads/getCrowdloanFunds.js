import { ApiPromise, WsProvider } from '@polkadot/api';
const paraID = 2023;
const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io/');

const main = async () => {
  console.log('fetching crowdloan data... this will take a very long time...');
  // Wait for Provider
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;
  // Get current block hash
  const firstContribution = 7843667;
  const latestBlock = (await api.rpc.chain.getBlock()).block.header;
  let amountRaised = Array();
  let timeStamp = Array();

  for (let i = firstContribution; i <= latestBlock.number.toNumber(); i++) {
    // Fetch crowdloan information
    const blockHash = (await api.rpc.chain.getBlockHash(i)).toJSON();
    //console.log(blockHash);
    const crowdloanInfo = (
      await api.query.crowdloan.funds.at(blockHash, paraID)
    ).toJSON();
    console.log(crowdloanInfo.raised);

    // There is a new contribution;
    const timestamp = (await api.query.timestamp.now.at(blockHash)).toNumber();
    const contribution = parseInt(crowdloanInfo.raised, 10);
    console.log(
      `Block: ${i}, Timestamp: ${new Date(
        timestamp
      )}, Contribution: ${contribution}`
    );
    currentAmountRaised = crowdloanInfo.raised;
  }
};
main();
