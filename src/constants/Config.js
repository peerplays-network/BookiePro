export default {
  version: '1.0.0', // TODO: this one should be in sync with version in package.json
  faucetUrls: ['https://595-dev-faucet.pixelplex.by'],
  blockchainUrls: [
    'wss://595-dev-blockchain.pixelplex.by/ws',
    'ws://52.221.226.91:8090',
    'wss://595-dev-blockchain.pixelplex.by/ws',
    'wss://bit.btsabc.org/ws',
    'wss://bts.transwiser.com/ws',
    'wss://bitshares.dacplay.org:8089/ws',
    'wss://openledger.hk/ws',
    'wss://secure.freedomledger.com/ws',
    'wss://testnet.bitshares.eu/ws',
    'wss://eu.openledger.info/ws',
    'ws://52.221.226.91:8090'
  ],
  softwareUpdateReferenceAccountName: 'peerplays1',
  gatewayAccountName: 'gateway1',
  dummyDataAccountId: '1.2.157' // TODO: remove this later, for the meantime we can use this to configure dummy data
}
