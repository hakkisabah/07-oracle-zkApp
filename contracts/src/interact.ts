/**
 * This script can be used to interact with the Add contract, after deploying it.
 *
 * We call the update() method on the contract, create a proof and send it to the chain.
 * The endpoint that we interact with is read from your config.json.
 *
 * This simulates a user interacting with the zkApp from a browser, except that here, sending the transaction happens
 * from the script and we're using your pre-funded zkApp account to pay the transaction fee. In a real web app, the user's wallet
 * would send the transaction and pay the fee.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/interact.js <network>`.
 */
import {Field, Mina, PrivateKey, shutdown, Signature, fetchAccount} from 'snarkyjs';
import fs from 'fs/promises';
import { OracleExample } from './OracleExample.js';

// check command line arg
let network = process.argv[2];
if (!network)
    throw Error(`Missing <network> argument.

Usage:
node build/src/interact.js <network>

Example:
node build/src/interact.js berkeley
`);
Error.stackTraceLimit = 1000;

// parse config and private key from file
type Config = { networks: Record<string, { url: string; keyPath: string }> };
let configJson: Config = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config = configJson.networks[network];
let key: { privateKey: string } = JSON.parse(
    await fs.readFile(config.keyPath, 'utf8')
);
let zkAppKey = PrivateKey.fromBase58(key.privateKey);

// set up Mina instance and contract we interact with
const Network = Mina.Network(config.url);
Mina.setActiveInstance(Network);
let zkAppAddress = zkAppKey.toPublicKey();
let zkApp = new OracleExample(zkAppAddress);

// compile the contract to create prover keys
console.log('compile the contract...');
await OracleExample.compile();

await fetchAccount({publicKey:zkAppAddress})

const response = await fetch(
    'https://3zfeebofnm6yarifpd6jb7hkd40dkxtt.lambda-url.eu-central-1.on.aws/score/1'
);
const data = await response.json();

const id = Field(data.data.id);
const creditScore = Field(data.data.creditScore);
const signature = Signature.fromJSON(data.signature);

// call verify() and send transaction
console.log('build transaction and create proof...');
let tx = await Mina.transaction({ feePayerKey: zkAppKey, fee: 0.1e9 },() => {
    zkApp.verify(
        id,
        creditScore,
        signature,
    );
});
await tx.prove();
console.log('send transaction...');
let sentTx = await tx.send();

if (sentTx.hash() !== undefined) {
    console.log(`
Success! Update transaction sent.

Your smart contract state will be updated
as soon as the transaction is included in a block:
https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
`);
}
shutdown();
