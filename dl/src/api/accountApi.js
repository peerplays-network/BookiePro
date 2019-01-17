import {ChainTypes} from 'peerplaysjs-lib';
import {Apis} from 'peerplaysjs-ws';

let op_history = parseInt(ChainTypes.operation_history, 10); // eslint-disable-line

class Api {

  lookupAccounts(startChar, limit) {
    return Apis.instance().db_api().exec('lookup_accounts', [
      startChar, limit
    ]);
  }
}

export default new Api();
