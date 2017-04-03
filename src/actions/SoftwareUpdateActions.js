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
}

/**
 * Public actions
 */
class SoftwareUpdateActions {
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

  static checkForSoftwareUpdate() {
    return (dispatch, getState) => {
      const referenceAccountId = getState().getIn(['softwareUpdate', 'referenceAccount', 'id']);
      if (!referenceAccountId) {
        // Reference account not set yet
        dispatch(SoftwareUpdateActions.listenToSoftwareUpdate());
      } else {
        // Get latest 100 transaction histories and parse it
        CommunicationService.fetchRecentHistory(referenceAccountId).then((history) => {
          history.forEach((transaction) => {
            const operationType = transaction.getIn(['op', 0]);
            // 0 is operation type for transfer
            if (operationType === ChainTypes.operations.transfer) {
              // Check memo
              const memo = transaction.getIn(['op', 1, 'memo']);
              if (memo && memo.get('message')) {
                try {
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
                } catch (e){
                }
              }
            }
          });
        });
      }

    }
  }

  static listenToSoftwareUpdate(attempt=3) {
    return (dispatch) => {
      const accountName = Config.softwareUpdateReferenceAccountName;
      // Fetch reference account in asycn manner
      CommunicationService.getFullAccount(accountName).then( (fullAccount) => {
        const account = fullAccount.get('account');
        const statistics = fullAccount.get('statistics');
        dispatch(SoftwareUpdateActions.setReferenceAccountAction(account));
        dispatch(SoftwareUpdateActions.setReferenceAccountStatisticsAction(statistics));
      }).catch((error) => {
        console.error('error is', error);
        // retry
        if (attempt > 0) {
          dispatch(SoftwareUpdateActions.listenToSoftwareUpdate(attempt-1));
        }
      });
    }
  }
}
export default SoftwareUpdateActions;
