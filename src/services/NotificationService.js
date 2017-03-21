import _ from 'lodash';

class NotificationService {

  /**
   * Generate private keys given account name and password
   */
  static convertTxHistoriesToNotifications(txHistories, prevLatestTxHistoryId) {
    let notifications = [];

    const prevLatestTxHistoryInstanceNumber = parseInt(prevLatestTxHistoryId.split('.')[2], 10);
    _.forEach(txHistories, (txHistory) => {
      const txHistoryInstanceNumber = parseInt(txHistories.get('id').split('.')[2], 10)
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
