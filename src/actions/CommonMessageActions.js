import {ActionTypes} from '../constants';
import MessageType from '../constants/MessageTypes';

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

// Custom function export for redux dev tools
export function addRandomMsg() {
  let index = Math.floor(Math.random() * 5) + 1;
  // let type = ActionTypes.COMMON_MSG_ADD_MSG;
  
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getId(loc) {
    let id = randomIntFromInterval(1,1000);

    if (loc === 'exchange') {
      id = 'e' + id;
    } else {
      id = 'b' + id;
    }

    return id;
  }

  function rdmLoc() {
    let i = randomIntFromInterval(1,2);

    switch(i) {
      case 1:
        return 'betslip';
      case 2:
        return 'exchange';
    }
  }

  function rdmType() {
    let i = randomIntFromInterval(1,4);

    switch(i) {
      case 1:
        return MessageType.SUCCESS;
      case 2:
        return MessageType.INFO;
      case 3:
        return MessageType.WARNING;
      case 4:
        return MessageType.ERROR;
      default:
        return MessageType.INFO;
    }
  }
  
  let mLoc = rdmLoc();
  let mType = rdmType();
  let mId = getId(mLoc);

  switch (index) {
    case 1:
      return{
        type: ActionTypes.COMMON_MSG_ADD_MSG,
        content: Math.floor(Math.random(Math.random() * 99).toString()),
        messageType: mType,
        loc: mLoc,
        id: mId
      };
    case 2:
      return{
        type: ActionTypes.COMMON_MSG_ADD_MSG,
        content: Math.floor(Math.random(Math.random() * 99).toString()),
        messageType: mType,
        loc: mLoc,
        id: mId
      };
    case 3:
      return{
        type: ActionTypes.COMMON_MSG_ADD_MSG,
        content: Math.floor(Math.random(Math.random() * 99).toString()),
        messageType: mType,
        loc: mLoc,
        id: mId
      };
    case 4:
      return{
        type: ActionTypes.COMMON_MSG_ADD_MSG,
        content: Math.floor(Math.random(Math.random() * 99).toString()),
        messageType: mType,
        loc: mLoc,
        id: mId
      };
  }
}

export default CommonMessageActions;
