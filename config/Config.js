const _ = require('lodash');
const {version} = require('../package.json');
const getClientEnvironment = require('./env');
const env = getClientEnvironment();
const {Manager} = require('../../peerplaysjs-ws/');
// Get the endpoints available.
const blockchainUrls = env.raw.apiEndpoints;
// Get the faucet endpoints available.
const faucetUrls = env.raw.faucetUrls;

// Shuffle the available enpoints.
const shuffledBlockchainUrls = _.shuffle(blockchainUrls);
const shuffledFaucetUrls = _.shuffle(faucetUrls);

let x = new Manager({
  url: 'wss://api.ppytest.blckchnd.com',
  urls: blockchainUrls
});

let t1 = new Date().getTime();
x.checkConnections().then((response) => {
  console.log(response);
  let sorted = Object.keys(response).sort((a,b) => response[a]-response[b]);
  console.log(new Date().getTime() - t1);

  console.log(sorted);

});

const Config = {
  APP_VERSION: version,
  APP_PACKAGE_VERSION: version,
  BLOCKCHAIN_URLS: shuffledBlockchainUrls,
  FAUCET_URLS: shuffledFaucetUrls,

  CORE_ASSET: 'PPY',
  FAUCET_URL: 'faucetUrls',
  BITSHARES_WS: 'wss://bitshares.openledger.info/ws',
  SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: 'ppcoreupdates',
  ACTIVE_WITNESS_ONLY: false,

  commonMessageModule: {
    numOfCommonMessageToDisplay: 1,
    sortingMethod: 'recent', // recent OR oldest
    timeout: 7500, // 7.5 seconds for auto-dismissal messages
    disableActionsInRedux: true
  },
};

module.exports = Config;