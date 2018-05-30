import _ from 'lodash';

import { PrivateKey, PublicKey } from 'peerplaysjs-lib';
import { version } from '../../package.json';
import { ChainConfig } from 'peerplaysjs-ws';

// This sets the prefx of the supporting libraries to the PPY prefix
// This line needs to be edited for connecting to chains with a different core asset
ChainConfig.setPrefix('PPY');

const blockchainUrls = [ // E-Chain
  'ws://ec2-35-182-42-231.ca-central-1.compute.amazonaws.com:8090',  // Canada
  'ws://ec2-18-195-242-233.eu-central-1.compute.amazonaws.com:8090', // Frankfurt
  'ws://ec2-54-252-182-8.ap-southeast-2.compute.amazonaws.com:8090'  // Sydney
]

// Shuffle list of blockchain nodes
// So every bookie app will not always connect to the first node in the list
const shuffledBlockhainUrls = _.shuffle(blockchainUrls);

const ASSET_ID = '1.3.1';

const Config = {
  version: version,
  oddsPrecision: 10000, // NOTE: I think this should be inside blockchain global objects, but it's not there yet so put it here temporarily
  blockchainUrls: shuffledBlockhainUrls,
  coreAsset: ASSET_ID,
  hardUpdateGracePeriod: 43200, // 12 Hour Hard-Update Grace Period
  btfTransactionFee: 0.00001,
  mbtfTransactionFee: 0.01,
  broadcastAccount: {
    name: 'pbsa-broadcasts',
    keys: {
      active: PublicKey.fromPublicKeyString("PPY5er7f4G75nnQ9gaexmsGd8QFFgM1ebztKG7FEohXrXF6qCu8r6")
    }
  },
  updateAccount: {
    name: 'bookie-updates',
    keys: {
      memo: PrivateKey.fromWif("5K9wZTcbZH2Y42VkxajEJc3HY8tqmXQ27yTRoHDpxtmQgwxgRPH") 
    }
  },
  gatewayAccountName: 'gateway1', // Any transfer from this account is marked as deposit/ withdraw with gateway
  useDummyData: false, // Set to true if you want to use dummy data
  // Set this to false to register through faucet
  // Remember to set the faucet urls properly beforehand
  // We don't have faucet for blocktrades testnet
  registerThroughRegistrar: false,
  faucetUrls: ['http://ec2-35-182-42-231.ca-central-1.compute.amazonaws.com:5000'], // E-Chain
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
    moneylineFilter: false,
    americanOdds: false
  },
  pingInterval: 9000 // Interval in seconds to ping the BlockChain.
};

export default Config
