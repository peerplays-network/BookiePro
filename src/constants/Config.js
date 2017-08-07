import _ from 'lodash';
import { PrivateKey } from 'peerplaysjs-lib';

const blockchainUrls = [
  'wss://595-dev-blockchain.pixelplex.by/ws',
  // 'wss://peerplays-dev.blocktrades.info/ws',
  // 'wss://ppy-node.bitshares.eu'
]

const shuffledBlockhainUrls = _.shuffle(blockchainUrls)

const Config = {
  version: '1.0.0', // TODO: this one should be in sync with version in package.json
  faucetUrls: ['https://595-dev-faucet.pixelplex.by'],
  blockchainUrls: shuffledBlockhainUrls,
  softwareUpdateReferenceAccountName: 'peerplays1',
  gatewayAccountName: 'gateway1',
  useDummyData: true,
  registerThroughRegistrar: false, // Set this to false to register through faucet
  accountRegistar: {
    name: 'init0',
    keys: {
      owner: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      active: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
      memo: PrivateKey.fromWif('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
    },
  },
  dummyDataAccountId: '1.2.243' // TODO: remove this
  // later, for the meantime we can use this to configure dummy data
}

export default Config
