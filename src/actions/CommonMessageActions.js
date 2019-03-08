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

  static clearAllMessages() {
    return {
      type: ActionTypes.COMMON_MSG_RESET,
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
   * @param {string} content - The message to be added.
   * @param {string} messageType - 'info', 'success', 'warning', or 'error'
   * @param {string} loc - 'exchange' or 'betslip'. Where the message is to appear.
   * @param {string} id - optional variable. If not supplied, one will be generated.
   * @returns
   * @memberof CommonMessageActions
   */
  static newMessage(content, messageType, loc, id) {
    return (dispatch, getState) => {
      // If an id has not been explicitely defined...
      if (!id) {
        // Generate a unique id for the new message based on the existing number of messages.
        id = getState().get('commonMessage').get('messageCount') + 1;
        
        if (loc === MessageLocation.EXCHANGE) {
          id = 'e' + id;
        } else {
          id = 'b' + id;
        }
      }

      dispatch(CommonMessagePrivateActions.addMessage(content, messageType, loc, id));
    };
  }

  static resetMessages() {
    return (dispatch) => {
      dispatch(CommonMessagePrivateActions.clearAllMessages());
    };
  }
}

export default CommonMessageActions;
