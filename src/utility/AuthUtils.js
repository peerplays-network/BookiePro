import {Apis} from 'peerplaysjs-ws';

const AuthUtils = {
  normalizeAccountName: function(value, previousValue) {
    if (!value.length) {
      return value;
    }

    if (/[^a-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  },
  lookupAccount: function(startChar, limit) {
    return Apis.instance().db_api().exec('get_account_by_name', [
      startChar, limit
    ]);
  }
};
export default AuthUtils;
