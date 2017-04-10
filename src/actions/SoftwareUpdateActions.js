import { ActionTypes, Config } from '../constants';
import { CommunicationService } from '../services';
import { ChainTypes } from 'graphenejs-lib';
import { StringUtils } from '../utility';

class SoftwareUpdatePrivateActions {
  static setUpdateParameter(version, displayText) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_UPDATE_PARAMETER,
      version,
      displayText
    }
  }
  static setReferenceAccountAction(referenceAccount) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT,
      referenceAccount
    }
  }

  static setReferenceAccountStatisticsAction(referenceAccountStatistics) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT_STATISTICS,
      referenceAccountStatistics
    }
  }
}

/**
 * Public actions
 */
class SoftwareUpdateActions {


  /**
   * Check for software update
   */
  static checkForSoftwareUpdate() {
    return (dispatch, getState) => {
      const referenceAccountId = getState().getIn(['softwareUpdate', 'referenceAccount', 'id']);
      if (!referenceAccountId) {
        // Reference account not set yet
        return dispatch(SoftwareUpdateActions.listenToSoftwareUpdate());
      } else {
        // Get latest 100 transaction histories and parse it
        return CommunicationService.fetchRecentHistory(referenceAccountId).then((history) => {
          history.forEach((transaction) => {
            const operationType = transaction.getIn(['op', 0]);
            // 0 is operation type for transfer
            if (operationType === ChainTypes.operations.transfer) {
              // Check memo
              const memo = transaction.getIn(['op', 1, 'memo']);
              if (memo && memo.get('message')) {
                // Assuming that we dun need to decrypt the message to parse 'software update' memo message
                const memoJson =  JSON.parse(StringUtils.hex2a(memo.toJS().message));
                const version = memoJson.version;
                const displayText = memoJson.displayText;

                // If it has version then it is an update transaction
                if (version) {
                  dispatch(SoftwareUpdatePrivateActions.setUpdateParameter(version, displayText));
                  // Terminate early
                  return false;
                }
              }
            }
          });
        }).catch((error) => {
          console.error('Fail to check for software update', error);
        });
      }

    }
  }

  /**
   * Listen to software update (fetch info from software update reference account)
   */
  static listenToSoftwareUpdate(attempt=3) {
    return (dispatch) => {
      const accountName = Config.softwareUpdateReferenceAccountName;
      // Fetch reference account in async manner
      return CommunicationService.getFullAccount(accountName).then( (fullAccount) => {
        const account = fullAccount.get('account');
        const statistics = fullAccount.get('statistics');
        dispatch(SoftwareUpdatePrivateActions.setReferenceAccountAction(account));
        dispatch(SoftwareUpdatePrivateActions.setReferenceAccountStatisticsAction(statistics));
        // Check for software update
        return dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
      }).catch((error) => {
        // Retry
        if (attempt > 0) {
          dispatch(SoftwareUpdateActions.listenToSoftwareUpdate(attempt-1));
        } else {
          // Throw error
          throw error;
        }
      });
    }
  }
}
export default SoftwareUpdateActions;
