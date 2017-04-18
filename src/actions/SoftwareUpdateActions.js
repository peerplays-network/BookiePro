import { ActionTypes, Config } from '../constants';
import { CommunicationService } from '../services';
import { ChainTypes } from 'graphenejs-lib';
import { StringUtils } from '../utility';
import log from 'loglevel';

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
  /**
   * Check for software update
   */
  static checkForSoftwareUpdate(attempt=3) {
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
                log.debug('Check for software update succeed');
              }
            }
          });
        }).catch((error) => {
          // Retry
          if (attempt > 0) {
            log.warn('Retry checking for software update', error);
            dispatch(SoftwareUpdateActions.checkForSoftwareUpdate(attempt-1));
          } else {
            // Log the error and give up
            log.error('Fail to check for software update', error);
          }
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
        dispatch(SoftwareUpdateActions.setReferenceAccountAction(account));
        dispatch(SoftwareUpdateActions.setReferenceAccountStatisticsAction(statistics));
        log.debug('Listen to software update succeed.')
        // Check for software update
        return dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
      }).catch((error) => {
        // Retry
        if (attempt > 0) {
          log.warn('Retry listening to software update', error);
          dispatch(SoftwareUpdateActions.listenToSoftwareUpdate(attempt-1));
        } else {
          log.error('Fail to listen to software update', error);
          // Throw error
          throw error;
        }
      });
    }
  }
}
export default SoftwareUpdateActions;
