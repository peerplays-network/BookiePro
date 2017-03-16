import { ActionTypes } from '../constants';

/**
 * Public actions
 */
class NotificationActions {
  static addNotificationsAction(notifications) {
    return {
      type: ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS,
      notifications
    }
  }

  static removeNotificationsAction(notifications) {
    return {
      type: ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS,
      notifications
    }
  }
}

export default NotificationActions;
