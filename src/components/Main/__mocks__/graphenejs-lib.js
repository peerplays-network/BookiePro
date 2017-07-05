const graphenejsLib = jest.genMockFromModule('peerplaysjs-lib');

graphenejsLib.ChainStore.init = function() {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {});
  });
}

module.exports = graphenejsLib;
