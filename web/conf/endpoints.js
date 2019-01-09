const endpoints = {
  environments: {
    beatrice: {
      apiEndpoints: [
        'wss://alex-pu.info/ws', // alex-pu ✅
        'wss://api1.peerplays.download/ws', //api1 ✅
        'wss://node.peerblock.trade:8090', // bitcoinsig ❌
        'wss://api.ppy.blckchnd.com', // blckchnd ✅
        'wss://api.eifos.org', // eifos-witness ✅
        'wss://node.firecrab-witness.com:8090', // firecrab-witness ❌
        'wss://peerplaysblockchain.net/mainnet/api', // houdini-witness ✅
        'wss://louie.peerplays.download', // louie ❌
        'wss://ip254.ip-91-121-48.eu', // melea-trust ✅
        'wss://api.ppy.nuevax.com', // nuevax ✅
        'ws://35.159.10.69:8090', // phi-guy ✅ (only works sometimes)
        'wss://ppyws.roelandp.nl/ws', // roelandp ✅
        'wss://api2.ppy.blckchnd.com', // royal-flush ✅
        'wss://ppyseed.spacemx.tech', // spacecrypt-witness ❌
        'wss://pma.blockveritas.co:8089/', // taconator-witness-wallet ✅
        'wss://api.ppy.us.altcap.io', // winner.winner.chicken.dinner ✅
        'wss://api.ppy.steemul.ru:8080', // xtar-testz ❌
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