const config = {
  environments: {
    baxter: {
      assetId: '1.3.1',
      apiEndpoints: [
        'wss://pta.blockveritas.co:8089', // taconator-witness
        'wss://bnode2.peerblock.trade', // bitcoinsig-test
        'wss://ppytest.proxyhosts.info/wss', // tf-witness
        'wss://api.ppytest.nuevax.com', // nuevax-test
        'wss://api.ppytest.blckchnd.com', // blckchnd-testnet
        'wss://139.ip-54-38-243.eu', // melea-witness
        'wss://api.test.ppy.us.altcap.io', // wwcd
        'wss://baxter.ppy.steemul.ru:8080' // xtar-testnet
      ],
      faucetUrls: ['http://faucet.bookiepro.fun:5000'],
      prefix: 'PPYTEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPYTEST8H4L2UeaXRRAt5nVR4GSGFdt232711wyzTQnFRJeoJeLXXZT23'
        },
        updates: {
          name: 'pbsa-broadcasts',
          key: '5Kjqz8HwRBCW7ZtvhmM2NhAqaPpLQvBShKjVNcKdbm8gdXi5V3J'
        }
      }
    },
    charlie: {
      assetId: '1.3.1',
      apiEndpoints: [
        'ws://ec2-35-183-1-21.ca-central-1.compute.amazonaws.com:8090'
      ],
      faucetUrls: ['http://ec2-35-183-1-21.ca-central-1.compute.amazonaws.com:5000'],
      prefix: 'PPY',
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
      prefix: 'PPY',
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
        'ws://ec2-35-182-42-231.ca-central-1.compute.amazonaws.com:8090', // Canada
        'ws://ec2-18-195-242-233.eu-central-1.compute.amazonaws.com:8090', // Frankfurt
        'ws://ec2-54-252-182-8.ap-southeast-2.compute.amazonaws.com:8090' // Sydney
      ],
      faucetUrls: ['http://ec2-35-182-42-231.ca-central-1.compute.amazonaws.com:5000'],
      prefix: 'PPY',
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

let current = 'dick'; // Set the current to dick by default.

// Check to make sure a valid target is specified.
if (process.env && process.env.TARGET && config.environments[process.env.TARGET]) {
  current = process.env.TARGET;
  console.log(`Environment defined as ${current}`);
} else if (!process.env.TARGET) {
  console.warn('Environment was not defined, using default.')
} else if (!config.environments[process.env.TARGET]) {
  console.warn('Environment supplied is invalid, using default.')
}

module.exports = config.environments[current];
