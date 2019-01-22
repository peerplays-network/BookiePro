const _ = require('lodash');
const {version} = require('../package.json');
const getClientEnvironment = require('./env');
const env = getClientEnvironment();

// Get the endpoints available.
const blockchainUrls = env.raw.apiEndpoints;
// Get the faucet endpoints available.
const faucetUrls = env.raw.faucetUrls;

// Shuffle the available enpoints.
const shuffledBlockchainUrls = _.shuffle(blockchainUrls);
const shuffledFaucetUrls = _.shuffle(faucetUrls);

const Config = {
  APP_VERSION: version,
  APP_PACKAGE_VERSION: version,
  BLOCKCHAIN_URLS: shuffledBlockchainUrls,
  FAUCET_URLS: shuffledFaucetUrls,

  CORE_ASSET: 'PPY',
  FAUCET_FILE: 'faucetUrls',
  BITSHARES_WS: 'wss://bitshares.openledger.info/ws',
  SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: 'ppcoreupdates',
};

module.exports = Config;