import { ActionTypes } from '../constants';
import { ChainTypes } from 'graphenejs-lib';
import _ from 'lodash';
import { StringUtils } from '../utility';
import Immutable from 'immutable';

let initialState = Immutable.Map({
  referenceAccount: null,
  version: '0.0.1', // minimum value, we not using null to avoid null checking
  displayText: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT: {
      const referenceAccount = action.referenceAccount;
      let version = null;
      let displayText = null;

      // Get latest update transaction
      const histories = referenceAccount && referenceAccount.get('history');
      if (histories) {
        let latestUpdateTransaction = null;
        histories.forEach((transaction) => {
          const operationType = transaction.getIn(['op', 0]);
          // 0 is operation type for transfer
          if (operationType === ChainTypes.operations.transfer) {
            latestUpdateTransaction = transaction;
            return false;
          }
        });

        // Check the memo of latest update transaction to find update information
        if (latestUpdateTransaction) {

          const memo = latestUpdateTransaction.getIn(['op', 1, 'memo']);

          if (memo && memo.get('message')) {

            try {
              // Assuming that we dun need to decrypt the message to parse 'software update' memo message
              const memoJson =  JSON.parse(StringUtils.hex2a(memo.toJS().message));

              version = memoJson.version;
              displayText = memoJson.displayText;

            } catch (e){

            }

          }
        }
      }

      return state.merge({
        referenceAccount,
        version,
        displayText
      });
    }
    default:
      return state;
  }
}
