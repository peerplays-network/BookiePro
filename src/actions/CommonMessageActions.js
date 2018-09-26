import {ActionTypes} from '../constants';

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
  static newMessage(content, messageType, loc) {
    return (dispatch, getState) => {
      let id = getState().get('commonMessage').get('messageCount') + 1;

      if (loc === 'exchange') {
        id = 'e' + id;
      } else {
        id = 'b' + id;
      }

      dispatch(CommonMessagePrivateActions.addMessage(content, messageType, loc, id));
    };
  }
}

export default CommonMessageActions;
