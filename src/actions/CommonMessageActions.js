import {ActionTypes} from '../constants';

class CommonMessagePrivateActions {
  static removeMessage(id) {
    return {
      type: ActionTypes.COMMON_MSG_REMOVE_MESSAGE,
      id
    };
  }
  static addMessage(content, messageType, loc) {
    return {
      type: ActionTypes.COMMON_MSG_ADD_MSG,
      content,
      messageType,
      loc
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
    return (dispatch) => {
      dispatch(CommonMessagePrivateActions.addMessage(content, messageType, loc));
    };
  }
}

export default CommonMessageActions;
