import { ActionTypes } from '../constants';
import { ChainTypes } from 'graphenejs-lib';
import _ from 'lodash';

let initialState = {
  referenceAccount: null,
  needHardUpdate: false,
  needSoftUpdate: false,
  version: null, //assuming format is A.B.C
  displayText: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT: {
      const referenceAccount = action.referenceAccount;
      let needHardUpdate = false;
      let needSoftUpdate = false;
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
          if (memo) {
            needHardUpdate = memo.need_hard_update;
            needSoftUpdate = memo.need_soft_update;
            version = memo.version;
            displayText = memo.display_text;
          }
        }
      }

      return Object.assign({}, state, {
        referenceAccount,
        needHardUpdate,
        needSoftUpdate,
        version,
        displayText
      });
    }
    default:
      return state;
  }
}
