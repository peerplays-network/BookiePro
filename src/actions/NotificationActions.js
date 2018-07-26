import {ActionTypes, LoadingStatus} from '../constants';
import {NotificationService} from '../services';
import AssetActions from './AssetActions';
import BettingMarketActions from './BettingMarketActions';
import log from 'loglevel';
import Immutable from 'immutable';
import {NotificationTypes} from '../constants';
import {I18n} from 'react-redux-i18n';

// Disable everything but software update notifications.
const DISABLE_NOTIFICATIONS = true;

/**
 * Private actions
 */
class NotificationPrivateActions {
  static prependNotificationsAction(notifications) {
    return {
      type: ActionTypes.NOTIFICATION_PREPEND_NOTIFICATIONS,
      notifications
    };
  }

  static setInitNotificationErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_ERROR,
      error
    };
  }

  static setInitNotificationLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_INIT_NOTIFICATION_LOADING_STATUS,
      loadingStatus
    };
  }

  static setUpdateNotificationErrorAction(error) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_ERROR,
      error
    };
  }

  static setUpdateNotificationLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.NOTIFICATION_SET_UPDATE_NOTIFICATION_LOADING_STATUS,
      loadingStatus
    };
  }
}

/**
 * Public actions
 */
class NotificationActions {
  // Mark notifications as read
  static markNotificationsAsReadAction() {
    return {
      type: ActionTypes.NOTIFICATION_MARK_NOTIFICATIONS_AS_READ
    };
  }

  /**
   * Update notifications given the transactions
   */
  static updateNotifications(transactions, attempt = 3) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      if (accountId) {
        const isShowNotification = getState().getIn([
          'setting',
          'settingByAccountId',
          accountId,
          'notification'
        ]);

        if (isShowNotification && !DISABLE_NOTIFICATIONS) {
          // Filter history and extract relevant info
          const {
            relevantAssetIds,
            relevantBettingMarketIds
          } = NotificationService.extractRelevantAdditionalInfo(transactions);
          dispatch(
            NotificationPrivateActions.setUpdateNotificationLoadingStatus(LoadingStatus.LOADING)
          );
          // Retrieve relevant info
          Promise.all([
            dispatch(AssetActions.getAssetsByIds(relevantAssetIds)),
            dispatch(BettingMarketActions.getBettingMarketsByIds(relevantBettingMarketIds))
          ])
            .then(result => {
              const assets = result[0];
              const bettingMarkets = result[1];
              const relevantAssetsById = Immutable.Map(
                assets.map(asset => [asset.get('id'), asset])
              );
              const relevantBettingMarketsById = Immutable.Map(
                bettingMarkets.map(bettingMarket => [bettingMarket.get('id'), bettingMarket])
              );
              // Create notifications and store it
              const notifications = NotificationService.convertTransactionsToNotifications(
                getState(),
                transactions,
                relevantAssetsById,
                relevantBettingMarketsById
              );
              dispatch(NotificationPrivateActions.prependNotificationsAction(notifications));
              dispatch(
                NotificationPrivateActions.setUpdateNotificationLoadingStatus(LoadingStatus.DONE)
              );
              log.debug('Update notification succeeds.');
            })
            .catch(error => {
              if (attempt > 0) {
                log.warn('Retry updating notification', error);
                return dispatch(NotificationActions.updateNotifications(transactions, attempt - 1));
              } else {
                log.error('Fail to update notification', error);
                dispatch(NotificationPrivateActions.setUpdateNotificationErrorAction(error));
              }
            });
        }
      }
    };
  }

  /**
   * Add soft update notification
   */
  static addSoftUpdateNotification(version, versionPublishDate, updateLink) {
    return dispatch => {
      // Create notification object and add it
      const type = NotificationTypes.SOFTWARE_UPDATE_AVAILABLE;
      const content = `${I18n.t('notification.software_update')}`;
      const date = new Date(Number.parseInt(versionPublishDate, 10));
      const link = updateLink;

      // Create notification object and add it
      const notification = NotificationService.createNotificationObject(
        type,
        content,
        date,
        link,
        version
      );

      const notifications = Immutable.List([notification]);
      dispatch(NotificationPrivateActions.prependNotificationsAction(notifications));
    };
  }

  /**
   * Add transaction history export notification
   */
  static addTransactionHistoryExportNotification() {
    // If notifications are disabled do not add this notification.
    if (DISABLE_NOTIFICATIONS) {
      return;
    }

    return dispatch => {
      const type = NotificationTypes.TRANSACTION_HISTORY_DATA_EXPORTED;
      const content = I18n.t('notification.transaction_history_data_exported');
      const date = new Date();
      // Create notification object and add it
      const notification = NotificationService.createNotificationObject(type, content, date);
      const notifications = Immutable.List([notification]);
      dispatch(NotificationPrivateActions.prependNotificationsAction(notifications));
    };
  }

  static removeNotificationsAction(notificationIds) {
    return {
      type: ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS,
      notificationIds
    };
  }
}

export default NotificationActions;
