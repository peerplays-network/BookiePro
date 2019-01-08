const endpoints = {
  environments: {
    beatrice: {
      apiEndpoints: [
        'wss://pma.blockveritas.co:8089/' // taconator-witness-wallet
      ],
      faucetUrls: [
        'https://faucet.peerplays.download/faucet'
      ]
    }
  }
}
let current = 'beatrice'; // Set the current default environment.

// Check to make sure a valid target is specified.
if (process.env && process.env.TARGET && endpoints.environments[process.env.TARGET]) {
  current = process.env.TARGET;
  console.log(`Environment defined as ${current}`);
} else if (!process.env.TARGET) {
  console.warn(`Environment was not defined, using default. (${current})`);
} else if (!endpoints.environments[process.env.TARGET]) {
  console.warn(`Environment supplied is invalid, using default. (${current})`);
}

// Export the current endpoints config with the additional name property.
module.exports = Object.assign(endpoints.environments[current], {
  name: current
});