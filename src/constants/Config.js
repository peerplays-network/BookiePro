import _ from 'lodash';

const blockchainUrls = [
  'wss://595-dev-blockchain.pixelplex.by/ws',
]

const shuffledBlockhainUrls = _.shuffle(blockchainUrls)

const Config = {
  version: '1.0.0', // TODO: this one should be in sync with version in package.json
  faucetUrls: ['https://595-dev-faucet.pixelplex.by'],
  blockchainUrls: shuffledBlockhainUrls,
  softwareUpdateReferenceAccountName: 'peerplays1',
  gatewayAccountName: 'gateway1',
  dummyDataAccountId: '1.2.138' // TODO: remove this later, for the meantime we can use this to configure dummy data
}

export default Config
