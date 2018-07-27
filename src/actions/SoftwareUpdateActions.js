import { ActionTypes, Config, ChainTypes } from '../constants';
import { CommunicationService } from '../services';
import { SoftwareUpdateUtils } from '../utility';
import log from 'loglevel';
import NotificationActions from './NotificationActions';
import AppActions from './AppActions';
import { Aes } from 'peerplaysjs-lib';

class SoftwareUpdatePrivateActions {
  static setUpdateParameter(version, displayText, date, link) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_UPDATE_PARAMETER,
      version,
      displayText,
      link, 
      date
    }
  }
  static setReferenceAccountStatisticsAction(referenceAccountStatistics) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT_STATISTICS,
      referenceAccountStatistics
    }
  }

  static setReferenceAccountAction(referenceAccount) {
    return {
      type: ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT,
      referenceAccount
    }
  }

}

/**
 * Public actions
 */
class SoftwareUpdateActions {

  static setReferenceAccountStatistics(referenceAccountStatistics) {
    return (dispatch, getState) => {
      // Check if this account made new transaction, if that's the case check for software update
      const currentMostRecentOp = getState().getIn(['softwareUpdate', 'referenceAccountStatistics', 'most_recent_op']);
      const updatedMostRecentOp = referenceAccountStatistics.get('most_recent_op')
      const hasMadeNewTransaction = currentMostRecentOp && (updatedMostRecentOp !== currentMostRecentOp);
      if (hasMadeNewTransaction) {
        dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
      }
      // Set the newest statistic
      dispatch(SoftwareUpdatePrivateActions.setReferenceAccountStatisticsAction(referenceAccountStatistics));
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
        // Get latest 100 transaction history and parse it
        return CommunicationService.fetchRecentHistory(referenceAccountId, null, 100).then((history) => {
          history.forEach((transaction) => {
            const operationType = transaction.getIn(['op', 0]);
            // 0 is operation type for transfer
            if (operationType === ChainTypes.operations.transfer) {
              // The encrypted message
              const memoMessage = transaction.getIn(['op', 1, 'memo', 'message']);               
              // The nonce included in the message
              const memoNonce = transaction.getIn(['op', 1, 'memo', 'nonce']);
              
              if (memoMessage) {
                const { broadcastAccount, updateAccount } = Config;
                // The public active key of the broadcast account
                let sendingPublic = broadcastAccount.keys.active; 

                // The private memo key of the receiving account
                let receivingPrivate = updateAccount.keys.memo;

                // Use the decrypt_with_checksum function
                let decryptedMessage = Aes.decrypt_with_checksum(receivingPrivate, sendingPublic, memoNonce, memoMessage);             
                
                // We need to decode the array into plain text
                let decoder = new TextDecoder('utf-8')
                
                // If everything went well, we can turn the decrypted message as a JSON object and get the variables we want from the object
                let message, version, displayText, date, link;
                try {
                  message = JSON.parse(decoder.decode(decryptedMessage)) // Parse the resulting plain text into a JSON object
                  version = message.version; // The version
                  date = message.date;
                  link = message.link;
                  displayText = message.displayText; // The text
                } catch (error) {
                  log.warn('Invalid memo, most likely this is not software update transaction');
                }

                // If it has valid version then it is an update transaction
                if (version && SoftwareUpdateUtils.isValidVersionNumber(version)) {
                  // Set update parameter
                  dispatch(SoftwareUpdatePrivateActions.setUpdateParameter(version, displayText, date, link));
                  const isNeedHardUpdate = SoftwareUpdateUtils.isNeedHardUpdate(version);
                  const isNeedSoftUpdate = SoftwareUpdateUtils.isNeedSoftUpdate(version);
                  
                  // Show software update popup if needed
                  if (isNeedHardUpdate) {
                    dispatch(AppActions.showSoftwareUpdatePopupAction(true));
                    dispatch(NotificationActions.addSoftUpdateNotification(version, date, link));
                    return false;
                  }
                  // Add notification if it is soft update
                  if (isNeedSoftUpdate) {
                    dispatch(NotificationActions.addSoftUpdateNotification(version, date, link));
                  }
                  log.trace('Check for software update succeed');
                  // Terminate early
                  return false;
                }
              }
            }
          });
        }).catch((error) => {
          // Retry
          if (attempt > 0) {
            log.warn('Retry checking for software update', error);
            return dispatch(SoftwareUpdateActions.checkForSoftwareUpdate(attempt-1));
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
      // Fetch reference account in async manner
      return CommunicationService.getFullAccount(Config.broadcastAccount.name).then( (fullAccount) => {
        if (fullAccount) {
          const account = fullAccount.get('account');
          const statistics = fullAccount.get('statistics');
          dispatch(SoftwareUpdatePrivateActions.setReferenceAccountAction(account));
          dispatch(SoftwareUpdateActions.setReferenceAccountStatistics(statistics));
          log.debug('Listen to software update succeed.')
          // Check for software update
          return dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
        }
      }).catch((error) => {
        // Retry
        if (attempt > 0) {
          log.warn('Retry listening to software update', error);
          return dispatch(SoftwareUpdateActions.listenToSoftwareUpdate(attempt-1));
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
