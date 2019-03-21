// GUI Wallet only uses the apiEndpoints & faucetUrls entries. Do not add the rest if using the config for the GUI Wallet.

const config = {
  environments: {
    alice: {
      assetId: '1.3.1',
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
      ],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPYTEST8H4L2UeaXRRAt5nVR4GSGFdt232711wyzTQnFRJeoJeLXXZT23'
        },
        updates: {
          name: 'bookie-updates',
          key: '5Kjqz8HwRBCW7ZtvhmM2NhAqaPpLQvBShKjVNcKdbm8gdXi5V3J'
        }
      }
    },
    beatrice: {
      assetId: '1.3.1',
      apiEndpoints: [
        'wss://pta.blockveritas.co:8089', // taconator-witness ✅
        'wss://bnode.peerblock.trade', // bitcoinsig-test ❌
        'wss://bnode2.peerblock.trade', // bitcoinsig-test ❌
        'wss://api.ppytest.nuevax.com', // nuevax-test ❌
        'wss://api.ppy-beatrice.blckchnd.com', // blckchnd-testnet ✅
        'wss://ip100.ip-54-37-165.eu/', // melea-trust [response code 502] ❌
        'wss://243.ip-51-38-237.eu/', // melea-trust [flagged as phishing recently. net::ERR_CERT_COMMON_NAME_INVALID] ❌
        'wss://api.test.ppy.us.altcap.io', // winner.winner.chicken.dinner ✅ [op codes out of date]
        'wss://peerplaysblockchain.net/testnet/api', // houdini-witness ✅
        'wss://api-beatrice01.eifos.org', // eifos-witness ✅
        'ws://159.69.223.206:8090', // blckchnd-testnet ✅
        'ws://52.59.217.195:8090', // phi-guy ✅
        'wss://testnet-ppyapi.spacemx.tech', //spacecrypt ✅
      ],
      faucetUrls: ['https://pbsa-beatrice-faucet.blockchainprojectsbv.com'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPYTEST8H4L2UeaXRRAt5nVR4GSGFdt232711wyzTQnFRJeoJeLXXZT23'
        },
        updates: {
          name: 'bookie-updates',
          key: '5Kjqz8HwRBCW7ZtvhmM2NhAqaPpLQvBShKjVNcKdbm8gdXi5V3J'
        }
      }
    },
    charlie: {
      assetId: '1.3.1',
      apiEndpoints: [
        'ws://ec2-35-183-78-0.ca-central-1.compute.amazonaws.com:8090'
      ],
      faucetUrls: ['http://ec2-35-183-78-0.ca-central-1.compute.amazonaws.com:5000'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPY4vR89Z4TiqxbcDDuv5BV7XRgxhfYquYvC8ciiDnRZanPCLcQJ4'
        },
        updates: {
          name: 'peerplays-updates',
          key: '5JnR1XHTj2BQtM4gf4tDkayfB4TQf15zBAwgSEMQcpyED21bNnv'
        }
      }
    },
    dick: {
      assetId: '1.3.1',
      apiEndpoints: [
        'ws://ec2-35-182-93-168.ca-central-1.compute.amazonaws.com:8090'
      ],
      faucetUrls: ['http://ec2-35-182-93-168.ca-central-1.compute.amazonaws.com:5000'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPY4vR89Z4TiqxbcDDuv5BV7XRgxhfYquYvC8ciiDnRZanPCLcQJ4'
        },
        updates: {
          name: 'peerplays-updates',
          key: '5JnR1XHTj2BQtM4gf4tDkayfB4TQf15zBAwgSEMQcpyED21bNnv'
        }
      }
    },
    elizabeth: {
      assetId: '1.3.1',
      apiEndpoints: [
        'ws://ec2-35-183-70-167.ca-central-1.compute.amazonaws.com:8090', // Canada
        'ws://ec2-18-195-242-233.eu-central-1.compute.amazonaws.com:8090', // Frankfurt
        'ws://ec2-54-252-182-8.ap-southeast-2.compute.amazonaws.com:8090' // Sydney
      ],
      faucetUrls: ['http://ec2-35-183-70-167.ca-central-1.compute.amazonaws.com:5000'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPY5er7f4G75nnQ9gaexmsGd8QFFgM1ebztKG7FEohXrXF6qCu8r6'
        },
        updates: {
          name: 'bookie-updates',
          key: '5K9wZTcbZH2Y42VkxajEJc3HY8tqmXQ27yTRoHDpxtmQgwxgRPH'
        }
      }
    }
  }
};

let current = 'elizabeth'; // Set the current to elizabeth by default.

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