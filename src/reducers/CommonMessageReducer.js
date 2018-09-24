import Immutable from 'immutable';
import {ActionTypes} from '../constants';
//import MessageType from '../constants/MessageTypes';

let initialState = Immutable.fromJS({
  exchangeMessages: [],
  betslipMessages: []
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.COMMON_MSG_ADD_MSG: {
      const nContent = action.content;
      const nMessageType = action.messageType;
      let newMsg = Immutable.fromJS([{
        content: nContent,
        messageType: nMessageType
      }]);
      const location = action.loc;

      if (location === 'exchange') {
        return state.update('exchangeMessages',(msgs) => newMsg.concat(msgs));
      } else {
        return state.update('betslipMessages', (msgs) => newMsg.concat(msgs));
      }
    }

    case ActionTypes.COMMON_MSG_REMOVE_MESSAGE: {
      // get current state of messages
      // operate on the one matching supplied id
      // set its 'type' to MessageTypes.NONE
      if (action.id.indexOf('e') !== -1) {
        // Location is of type 'exchange'
        // Extract the index
        const e = action.id.split('e')[1];
        // Delete the item from the list in state
        const newExchangeMsgState = state.get('exchangeMessages').delete(parseFloat(e));
        
        return state.set('exchangeMessages', newExchangeMsgState);
      } else {
        // Location is of type 'betslip'
        // Extract the index
        const b = action.id.split('b')[1];
        // Delete the item from the list in state.
        const newBetslipMsgState = state.get('betslipMessages').delete(parseFloat(b));

        return state.set('betslipMessages', newBetslipMsgState);
      }
    }

    case ActionTypes.COMMON_MSG_RESET: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
