import Immutable from 'immutable';
import {ActionTypes} from '../constants';

let initialState = Immutable.fromJS({
  messageCount: 0,
  exchangeMessages: [],
  betslipMessages: []
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.COMMON_MSG_ADD_MSG: {
      let newMsg = Immutable.fromJS([{
        content: action.content,
        messageType: action.messageType,
        id: action.id
      }]);
      const location = action.loc;
      let messageCount = state.get('messageCount') + 1;

      if (location === 'exchange') {
        let newState = state.update('exchangeMessages', (msgs) => newMsg.concat(msgs))
          .set('messageCount', messageCount);

        return newState;

      } else {
        let newState = state.update('betslipMessages', (msgs) => newMsg.concat(msgs))
          .set('messageCount', messageCount);

        return newState;
      }
    }

    case ActionTypes.COMMON_MSG_REMOVE_MESSAGE: {
      // get current state of messages
      // operate on the one matching supplied id
      let messageCount = state.get('messageCount');
      const newMessageCount = --messageCount;
      const id = action.id;

      if (id.indexOf('e') !== -1) {
        // Location is of type 'exchange'
        // Delete the item from the list in state
        let newExchangeMsgState = state.get('exchangeMessages');

        let i = 0;
        newExchangeMsgState.forEach((m) => {
          if (m.get('id') !== id) {
            i = i + 1;
          } else {
            newExchangeMsgState = newExchangeMsgState.delete(i);
          }
        });
        

        return state.set('exchangeMessages', newExchangeMsgState)
          .set('messageCount', newMessageCount);
      } else {
        // Location is of type 'betslip'
        // Delete the item from the list in state.
        let newBetslipMsgState = state.get('betslipMessages');

        let i = 0;
        newBetslipMsgState.forEach((m) => {
          if (m.get('id') !== id) {
            i = i + 1;
          } else {
            newBetslipMsgState = newBetslipMsgState.delete(i);
          }
        });

        return state.set('betslipMessages', newBetslipMsgState)
          .set('messageCount', newMessageCount);
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
