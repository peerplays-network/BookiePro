import {ActionTypes} from '../constants';
import {FileSaverUtils} from '../utility';
import RawHistoryActions from './RawHistoryActions';

class AccountPrivateActions {
  static setStatisticsAction(statistics) {
    return {
      type: ActionTypes.ACCOUNT_SET_STATISTICS,
      statistics
    };
  }
}

/**
 * Public actions
 */
class AccountActions {
  static downloadPassword() {
    return (dispatch, getState) => {
      const password = getState().getIn(['account', 'password']);
      let blob = new Blob([password], {
        type: 'text/plain'
      });
      FileSaverUtils.saveAs(blob, 'account-recovery-file.txt');
    };
  }

  static setIsLoggedInAction(isLoggedIn) {
    return {
      type: ActionTypes.ACCOUNT_SET_IS_LOGGED_IN,
      isLoggedIn
    };
  }

  static setStatistics(statistics) {
    return (dispatch, getState) => {
      // Check if this account made new transaction, if that's the case update the notification
      const currentMostRecentOp = getState().getIn(['account', 'statistics', 'most_recent_op']);
      const updatedMostRecentOp = statistics.get('most_recent_op');
      const hasMadeNewTransaction =
        currentMostRecentOp && updatedMostRecentOp !== currentMostRecentOp;

      if (hasMadeNewTransaction) {
        dispatch(RawHistoryActions.checkForNewRawHistory());
      }

      // Set statistics
      dispatch(AccountPrivateActions.setStatisticsAction(statistics));
    };
  }

  static setAccountAction(account) {
    return {
      type: ActionTypes.ACCOUNT_SET_ACCOUNT,
      account
    };
  }

  static setPasswordAction(password) {
    return {
      type: ActionTypes.ACCOUNT_SET_PASSWORD,
      password
    };
  }
}

export default AccountActions;
