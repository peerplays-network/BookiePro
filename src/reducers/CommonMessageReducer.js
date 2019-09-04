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
      const location = action.loc + 'Messages';

      let messageCount = state.get('messageCount') + 1;

      let newState = state.update(location, (msgs) => newMsg.concat(msgs))
        .set('messageCount', messageCount);

      return newState;
    }

    case ActionTypes.COMMON_MSG_REMOVE_MESSAGE: {
      // get current state of messages
      // operate on the one matching supplied id
      let messageCount = state.get('messageCount');
      const newMessageCount = messageCount > 0 ? --messageCount : 0; // cannot have negative count


      const id = action.id;
      const newExchangeMsgState = state.get('exchangeMessages')
        .filter((m) => {
          let mID = m.get('id');

          // Filter exchange messages.
          return mID !== id;
        });
      const newBetslipMessageState = state.get('betslipMessages')
        .filter((m) => {
          let mID = m.get('id');

          // Filter betslip messages.
          return mID !== id;
        });

      return state.set('exchangeMessages', newExchangeMsgState)
        .set('betslipMessages', newBetslipMessageState)
        .set('messageCount', newMessageCount);
    }

    case ActionTypes.COMMON_MSG_RESET: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
