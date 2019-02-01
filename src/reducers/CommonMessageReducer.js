import Immutable from 'immutable';
import ActionTypes from '../constants/ActionTypes';

let initialState = Immutable.fromJS({
  messageCount: 0,
  headerMessages: [],
  sideBarMessages: [],
  activeMessage: false,
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
        .set('messageCount', messageCount)
        .set('activeMessage', true);

      return newState;
    }

    case ActionTypes.COMMON_MSG_REMOVE_MSG: {
      // get current state of messages
      // operate on the one matching supplied id
      let messageCount = state.get('messageCount');
      const newMessageCount = --messageCount;
      const id = action.id;
      const newExchangeMsgState = state.get('headerMessages')
        .filter((m) => {
          let mID = m.get('id');

          // Filter exchange messages.
          return mID === 'h' + id;
        });
      const newsideBarMessagestate = state.get('sideBarMessages')
        .filter((m) => {
          let mID = m.get('id');

          // Filter betslip messages.
          return mID === 's' + id;
        });

      return state.set('headerMessages', newExchangeMsgState)
        .set('sideBarMessages', newsideBarMessagestate)
        .set('messageCount', newMessageCount)
        .set('activeMessage', false);
    }

    case ActionTypes.COMMON_MSG_RESET: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
