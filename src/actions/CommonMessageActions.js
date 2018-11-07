import {ActionTypes} from '../constants';
import MessageLocation from '../constants/MessageLocation';

class CommonMessagePrivateActions {
  static removeMessage(id) {
    return {
      type: ActionTypes.COMMON_MSG_REMOVE_MESSAGE,
      id
    };
  }
  static addMessage(content, messageType, loc, id) {
    return {
      type: ActionTypes.COMMON_MSG_ADD_MSG,
      content,
      messageType,
      loc,
      id
    };
  }
}

class CommonMessageActions {
  static clearMessage(id) {
    return (dispatch) => {
      dispatch(CommonMessagePrivateActions.removeMessage(id));
    };
  }
  /**
   *
   *
   * @static
   * @param {*} content - The message to be added.
   * @param {*} messageType - 'info', 'success', 'warning', or 'error'
   * @param {*} loc - 'exchange' or 'betslip'. Where the message is to appear.
   * @returns
   * @memberof CommonMessageActions
   */
  static newMessage(content, messageType, loc) {
    return (dispatch, getState) => {
      // Generate a unique id for the new message based on the existing number of messages.
      let id = getState().get('commonMessage').get('messageCount') + 1;

      if (loc === MessageLocation.EXCHANGE) {
        id = 'e' + id;
      } else {
        id = 'b' + id;
      }

      dispatch(CommonMessagePrivateActions.addMessage(content, messageType, loc, id));
    };
  }
}

export default CommonMessageActions;
