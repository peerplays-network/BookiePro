import _ from 'lodash';

import { PrivateKey, PublicKey } from 'peerplaysjs-lib';
import { version } from '../../package.json';
import { ChainConfig } from 'peerplaysjs-ws';

console.log(`Configuration loaded for ${process.env.name || 'unknown'}`)

// This sets the prefx of the supporting libraries to the PPY prefix
// This line needs to be edited for connecting to chains with a different core asset
ChainConfig.setPrefix(process.env.prefix);

const blockchainUrls = process.env.apiEndpoints;

// Shuffle list of blockchain nodes
// So every bookie app will not always connect to the first node in the list
const shuffledBlockhainUrls = _.shuffle(blockchainUrls);

const ASSET_ID = process.env.assetId;

const Config = {
  version: version,
  oddsPrecision: 10000, // NOTE: I think this should be inside blockchain global objects, but it's not there yet so put it here temporarily
  blockchainUrls: shuffledBlockhainUrls,
  coreAsset: ASSET_ID,
  hardUpdateGracePeriod: 43200, // 12 Hour Hard-Update Grace Period
  btfTransactionFee: 0.00001,
  mbtfTransactionFee: 0.01,
  broadcastAccount: {
    name: process.env.accounts.broadcasts.name,
    keys: {
      active: PublicKey.fromPublicKeyString(process.env.accounts.broadcasts.key)
    }
  },
  updateAccount: {
    name: process.env.accounts.updates.name,
    keys: {
      memo: PrivateKey.fromWif(process.env.accounts.updates.key)
    }
  },
  gatewayAccountName: 'gateway1', // Any transfer from this account is marked as deposit/ withdraw with gateway
  useDummyData: false, // Set to true if you want to use dummy data
  // Set this to false to register through faucet
  // Remember to set the faucet urls properly beforehand
  // We don't have faucet for blocktrades testnet
  registerThroughRegistrar: false,
  faucetUrls: process.env.faucetUrls,
  accountRegistar: {
    name: 'nathan',
    keys: {
      owner: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      active: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      memo: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
    },
  },
  dummyDataAccountId: '1.2.243', // TODO: remove this
  // Anything smaller than these configured numbers are to be treated as dust.
  dust: {
    exchangeCoin: 0.001, // On the simple betting widget, aggregated bets are displayed in their base coin (BTC, BTF, etc.) with a precision of three.
    coin: 0.00001,       // The base coin. ie: BTC, BTF, etc.
    miliCoin: 0.01       // The mili version of the base coin. ie: mBTC, mBTF, etc.
  },
  features: {
    withdrawels: false,
    deposits: false,
    currency: 'BTF',
    americanOdds: false
  },
  pingInterval: 9000 // Interval in seconds to ping the BlockChain.
};

export default Config
