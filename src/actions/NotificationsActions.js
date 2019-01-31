import ActionTypes from '../constants/ActionTypes';
import NotificationMessage from '../app/NotificationMessage';

class NotificationsPrivateActions {
  /**
   * Private Redux Action Creator (NOTIFICATIONS_SET_MESSAGES)
   * Set List of notices
   *
   * @param {Immutable.List} messages
   * @returns {{type, payload: *}}
   */
  static setMessagesAction(messages) {
    return {
      type: ActionTypes.NOTIFICATIONS_SET_MESSAGES,
      payload: {
        messages: messages
      }
    };
  }
}

class NotificationsActions {

  /**
 * Update List of notices with software message
 *
 * @param {NotificationMessage} message
 * @returns {function(*, *)}
 */
  static addUpdateSoftwareMessage(message) {
    return (dispatch, getState) => {
      let messages = getState().notificationsReducer.messages,
        newListMessages = messages.filter((message) => {
          return NotificationMessage.TYPES.SOFTWARE_UPDATE !== message.type;
        });
      dispatch(NotificationsPrivateActions.setMessagesAction(newListMessages.unshift(message)));
    };
  }

  /**
 * Remove message from List of notices by id
 *
 * @param {String} id
 * @returns {function(*, *)}
 */
  static closeMessage(id) {
    return (dispatch, getState) => {
      let messages = getState().notificationsReducer.messages,
        newListMessages = messages.update(messages.findIndex((message) => {
          return id === message.id;
        }), (message) => {
          return message;
        });

      if (messages !== newListMessages) {
        dispatch(NotificationsPrivateActions.setMessagesAction(newListMessages));
      }
    };
  }
}

export default NotificationsActions;