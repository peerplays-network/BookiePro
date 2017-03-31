import _ from 'lodash';
import { BlockchainUtils } from '../utility';
const { getObjectIdInstanceNumber } = BlockchainUtils;

class NotificationService {

  /**
   * Generate private keys given account name and password
   */
  static convertTxHistoriesToNotifications(txHistories, prevLatestTxHistoryId) {
    let notifications = [];
    const prevLatestTxHistoryInstanceNumber = getObjectIdInstanceNumber(prevLatestTxHistoryId);
    txHistories.forEach( txHistory => {
      const txHistoryInstanceNumber = getObjectIdInstanceNumber(txHistory.get('id'));
      if (txHistoryInstanceNumber > prevLatestTxHistoryInstanceNumber) {
        //TODO: determine the conversion later, for now just use history object as it is
        notifications.push(txHistory);
      } else {
        // Terminate early
        return false;
      }
    });

    // Reverse the array so it comes from oldest one
    return notifications;
  }
}

export default NotificationService;
