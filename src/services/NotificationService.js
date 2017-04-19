import _ from 'lodash';
import Immutable from 'immutable';
import { BlockchainUtils } from '../utility';
import { NotificationTypes } from '../constants';
const { getObjectIdInstanceNumber, calcBlockTime } = BlockchainUtils;
import { I18n } from 'react-redux-i18n';
import { ChainTypes } from 'graphenejs-lib';

// TODO: dummy operation types, replace with valid operation type from ChainTypes graphenejs-lib later
const dummyOperationType = {
  betting_market_resolved: 10001,
}

class NotificationService {
  // Use this to generate notification id
  static nextNotificationId = 0;
  /**
   * Filter relevant transactions that are useful for notifications
   */
  static filterRelevantTransactions(transactions, prevLatestTxHistoryId) {
    let relevantTransactions = Immutable.List();
    const prevLatestTxHistoryInstanceNumber = getObjectIdInstanceNumber(prevLatestTxHistoryId);
    transactions.forEach( (transaction) => {
      const txHistoryInstanceNumber = getObjectIdInstanceNumber(transaction.get('id'));
      // Add only new transactions to the notifications
      if (txHistoryInstanceNumber > prevLatestTxHistoryInstanceNumber) {
        const operationType = transaction.getIn(['op', 0]);
        // Add transaction to the list if it satisfy the following requirements
        if (operationType === ChainTypes.operations.transfer ||
        operationType === dummyOperationType.betting_market_resolved) {
          relevantTransactions = relevantTransactions.push(transaction);
        }
      } else {
        // Terminate early
        return false;
      }
    });
    return relevantTransactions;
  }

  /**
   * Extract relevant info (asset id and betting market id from  transactions)
   */
  static extractRelevantInfo(transactions) {
    let relevantAssetIds = Immutable.Set();
    let relevantBettingMarketIds = Immutable.Set();

    transactions.forEach( (transaction) => {
      const operationType = transaction.getIn(['op',0]);
      const operationContent = transaction.getIn(['op',1]);

      if (operationType === ChainTypes.operations.transfer) {
        // Extract asset Id
        const assetId = operationContent.getIn(['amount', 'asset_id']);
        relevantAssetIds = relevantAssetIds.add(assetId);
      } else if (operationType === dummyOperationType.betting_market_resolved) {
        // Extract betting market Id
        const bettingMarketId = operationContent.get('betting_market_id');
        relevantBettingMarketIds = relevantBettingMarketIds.add(bettingMarketId);
      }
    });
    return {
      relevantAssetIds,
      relevantBettingMarketIds
    }
  }

  /**
   * Convert transaction history to notification object
   * Notification object will look the following
   * {
   *   id: number (this will be generated, useful for removal)
   *   type: NotificationTypes
   *   content: String
   *   date: Date
   * }
   */
  static convertTransactionsToNotifications(state, transactions, relevantAssetsById, relevantBettingMarketsById) {
    const globalProperty = state.getIn(['app', 'blockchainGlobalProperty']);
    const dynamicGlobalProperty = state.getIn(['app', 'blockchainDynamicGlobalProperty']);
    const myAccountId = state.getIn(['account', 'account', 'id']);
    // TODO: get currency
    const currency = 'BTC';
    let notifications = Immutable.List();
    transactions.forEach( transaction => {
      const operationType = transaction.getIn(['op',0]);
      const operationContent = transaction.getIn(['op',1]);
      const blockNum = transaction.get('block_num');
      const date = calcBlockTime(blockNum, globalProperty, dynamicGlobalProperty);

      switch (operationType) {
        case ChainTypes.operations.transfer: {
          // Only handle transfer from gateway
          // TODO: check if it is from gateway
          // const from = operationContent.get('from');
          const isFromGateway = true;
          const isForMe = operationContent.get('to') === myAccountId;
          if (isFromGateway && isForMe) {
            // Get amount and check
            const assetId = operationContent.getIn(['amount', 'asset_id']);
            const assetPrecision = relevantAssetsById.getIn([assetId, 'precision']);
            const amount = operationContent.getIn(['amount', 'amount']) / Math.pow(10, assetPrecision);

            // Create notification object and add it
            const notification = Immutable.Map({
              type: NotificationTypes.DEPOSIT,
              content: I18n.t('notification.deposit', { amount, currency }),
              date
            });
            notifications = notifications.push(notification);
          }
          break;
        }
        case dummyOperationType.betting_market_resolved: {
            // Create notification object and add it
          const notification = Immutable.Map({
            type: NotificationTypes.BET_RESOLVED,
            content: I18n.t('notification.bet_resolved'),
            date
          });
          notifications = notifications.push(notification);
          break;
        }
        default: break;
      }
    });

    return notifications;
  }
}

export default NotificationService;
