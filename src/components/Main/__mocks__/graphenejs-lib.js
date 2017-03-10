const graphenejsLib = jest.genMockFromModule('graphenejs-lib');

graphenejsLib.ChainStore.init = function() {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {});
  });
}

module.exports = graphenejsLib;
