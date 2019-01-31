import {EmitterInstance} from 'peerplaysjs-lib';

class ChainStoreHeartbeater {
  constructor() {
    this.heartBeatTimer = null;
  }

  setHeartBeatChainStore(cb) {
    let emitter = EmitterInstance.emitter();
    emitter.on('heartbeat', () => {

      if (this.heartBeatTimer) {
        clearInterval(this.heartBeatTimer);
      }

      this.heartBeatTimer = setInterval(() => {
        return cb();
      }, 30000);
    });
  }
}

export default ChainStoreHeartbeater;