import * as fs from 'fs';
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';

// Global Variables
// Number of accounts to Create
const nAccounts = 10;

const createAccount = async () => {
  // Initialize WASM
  await cryptoWaitReady();

  // Create a keyring instance
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

  // Generate Mnemonic seed
  const mnemonic = mnemonicGenerate();

  // Create Account
  const pair = keyring.createFromUri(mnemonic, { name: 'sr25519' });

  return [mnemonic, pair.address];
};

const main = async () => {
  // Variables
  let accounts = {};
  let mnemonics = Array();
  let publicKeys = Array();

  console.log(`🤖 - Creating ${nAccounts} accounts!`);
  // Loop for each Account
  for (let i = 0; i < nAccounts; i++) {
    [mnemonics[i], publicKeys[i]] = await createAccount();
  }

  accounts.mnemonics = mnemonics;
  accounts.publicKeys = publicKeys;

  // Save data to JSON file
  const accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync('accounts.json', accountsJSON, 'utf-8');

  console.log('\n\n ✔️ Done!');
};

main();
