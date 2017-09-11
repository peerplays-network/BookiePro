import _ from 'lodash';
import Immutable from 'immutable';
import { BlockchainUtils } from '../utility';
import { NotificationTypes, ChainTypes } from '../constants';
const { calcBlockTime } = BlockchainUtils;
import { I18n } from 'react-redux-i18n';

class NotificationService {
  // Use this to generate notification id
  static nextNotificationId = 0;

  /**
   * Extract relevant info (asset id and betting market id from  transactions)
   */
  static extractRelevantAdditionalInfo(transactions) {
    let relevantAssetIds = Immutable.List();
    let relevantBettingMarketIds = Immutable.List();

    transactions.forEach( (transaction) => {
      const operationType = transaction.getIn(['op',0]);
      const operationContent = transaction.getIn(['op',1]);

      if (operationType === ChainTypes.operations.transfer) {
        // Extract asset Id
        const assetId = operationContent.getIn(['amount', 'asset_id']);
        relevantAssetIds = relevantAssetIds.push(assetId);
      } else if (operationType === ChainTypes.operations.betting_market_group_resolved) {
        // Extract betting market Id
        const resolutions = operationContent.get('resolutions');
        const bettingMarketIds = resolutions.map(resolution => resolution.get(0));
        relevantBettingMarketIds = relevantBettingMarketIds.concat(bettingMarketIds);
      }
    });

    // Unique
    relevantAssetIds = relevantAssetIds.toSet().toList();
    relevantBettingMarketIds = relevantBettingMarketIds.toSet().toList();
    return {
      relevantAssetIds,
      relevantBettingMarketIds
    }
  }

  /**
   * Convert transaction history to notification object
   * Notification object will look the following
   * {
   *   type: NotificationTypes
   *   content: String
   *   date: Date
   *   isRead: false
   * }
   */
  static convertTransactionsToNotifications(state, transactions, relevantAssetsById, relevantBettingMarketsById) {
    const globalProperty = state.getIn(['app', 'blockchainGlobalProperty']);
    const dynamicGlobalProperty = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const myAccountId = state.getIn(['account', 'account', 'id']);
    const isShowNotificationCard = state.getIn(['app', 'isShowNotificationCard']);

    const setting = state.getIn(['setting', 'settingByAccountId', myAccountId]) || state.getIn(['setting', 'defaultSetting']);
    const currency = setting.get('currencyFormat');
    let notifications = Immutable.List();
    transactions.forEach( transaction => {
      const operationType = transaction.getIn(['op',0]);
      const operationContent = transaction.getIn(['op',1]);
      const blockNum = transaction.get('block_num');
      const date = calcBlockTime(blockNum, globalProperty, dynamicGlobalProperty);

      switch (operationType) {
        case ChainTypes.operations.transfer: {
          // Only handle transfer from gateway
          const gatewayAccountId = state.getIn(['app', 'gatewayAccount', 'id']);
          const isFromGateway = operationContent.get('from') === gatewayAccountId;
          const isForMe = operationContent.get('to') === myAccountId;
          if (isFromGateway && isForMe) {
            // Get amount and check
            const assetId = operationContent.getIn(['amount', 'asset_id']);
            const assetPrecision = relevantAssetsById.getIn([assetId, 'precision']);
            const amount = operationContent.getIn(['amount', 'amount']) / Math.pow(10, assetPrecision);

            const type = NotificationTypes.DEPOSIT;
            const content = I18n.t('notification.deposit', { amount, currency });
            // Mark as read if notification card is shown
            const isRead = isShowNotificationCard;
            // Create notification object and add it
            const notification = NotificationService.createNotificationObject(type, content, date, isRead);
            notifications = notifications.push(notification);
          }
          break;
        }
        case ChainTypes.operations.betting_market_group_resolved: {
          const type = NotificationTypes.BET_RESOLVED;
          const content = I18n.t('notification.bet_resolved');
          // Mark as read if notification card is shown
          const isRead = isShowNotificationCard;
          // Create notification object and add it
          const notification = NotificationService.createNotificationObject(type, content, date, isRead);
            // Create notification object and add it
          notifications = notifications.push(notification);
          break;
        }
        default: break;
      }
    });

    return notifications;
  }

  // Create notification object
  static createNotificationObject(type, content, date, isRead=false) {
    const id = NotificationService.nextNotificationId;
    NotificationService.nextNotificationId += 1;

    return Immutable.Map({
      id,
      type,
      content,
      date,
      isRead
    });
  }
}

export default NotificationService;
