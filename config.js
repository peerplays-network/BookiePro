const config = {
  environments: {
    someEnvironmentName: {
      assetId: '1.3.1',
      apiEndpoints: [
        'insert api endpoint urls here' // multiple are supported.
      ],
      faucetUrls: ['insert faucet url here'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'broadcasts',
          key: 'insertKeyHere'
        },
        updates: {
          name: 'updates',
          key: 'insertKeyHere'
        }
      }
    }
  }
};

let current = 'someEnvironmentName'; // Set the current default environment.

// Check to make sure a valid target is specified.
if (process.env && process.env.TARGET && config.environments[process.env.TARGET]) {
  current = process.env.TARGET;
  console.log(`Environment defined as ${current}`);
} else if (!process.env.TARGET) {
  console.warn(`Environment was not defined, using default. (${current})`);
} else if (!config.environments[process.env.TARGET]) {
  console.warn(`Environment supplied is invalid, using default. (${current})`);
}

// Export the current config with the additional name property.
module.exports = Object.assign(config.environments[current], {
  name: current
});
