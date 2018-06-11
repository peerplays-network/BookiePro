import _ from 'lodash';

import { PrivateKey, PublicKey } from 'peerplaysjs-lib';
import { version } from '../../package.json';
import { ChainConfig } from 'peerplaysjs-ws';
import environment from '../../config';

// This sets the prefx of the supporting libraries to the PPY prefix
// This line needs to be edited for connecting to chains with a different core asset
ChainConfig.setPrefix(environment.prefix);

const blockchainUrls = environment.apiEndpoints;

// Shuffle list of blockchain nodes
// So every bookie app will not always connect to the first node in the list
const shuffledBlockhainUrls = _.shuffle(blockchainUrls);

const ASSET_ID = environment.assetId;

const Config = {
  version: version,
  oddsPrecision: 10000, // NOTE: I think this should be inside blockchain global objects, but it's not there yet so put it here temporarily
  blockchainUrls: shuffledBlockhainUrls,
  coreAsset: ASSET_ID,
  hardUpdateGracePeriod: 43200, // 12 Hour Hard-Update Grace Period
  btfTransactionFee: 0.00001,
  mbtfTransactionFee: 0.01,
  broadcastAccount: {
    name: environment.accounts.broadcasts.name,
    keys: {
      active: PublicKey.fromPublicKeyString(environment.accounts.broadcasts.key)
    }
  },
  updateAccount: {
    name: environment.accounts.updates.name,
    keys: {
      memo: PrivateKey.fromWif(environment.accounts.updates.key)
    }
  },
  gatewayAccountName: 'gateway1', // Any transfer from this account is marked as deposit/ withdraw with gateway
  useDummyData: false, // Set to true if you want to use dummy data
  // Set this to false to register through faucet
  // Remember to set the faucet urls properly beforehand
  // We don't have faucet for blocktrades testnet
  registerThroughRegistrar: false,
  faucetUrls: environment.faucetUrls,
  accountRegistar: {
    name: 'nathan',
    keys: {
      owner: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      active: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      memo: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
    },
  },
  dummyDataAccountId: '1.2.243', // TODO: remove this
  features: {
    withdrawels: false,
    deposits: false,
    currency: 'BTF',
    americanOdds: false
  },
  pingInterval: 9000 // Interval in seconds to ping the BlockChain.
};

export default Config
