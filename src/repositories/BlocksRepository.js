import {Apis} from 'peerplaysjs-ws';

class BlocksRepository {
  static fetchBlockById(id) {
    return Apis.instance().db_api().exec('get_block', [id]).then(function (block) {
      return block;
    }).catch(function (error) {
      console.log('BlocksRepository', error);
    });
  }
}

export default BlocksRepository;