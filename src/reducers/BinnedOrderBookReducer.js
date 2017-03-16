import { ActionTypes } from '../constants';
import _ from 'lodash';

let initialState = {
  binnedOrderBooks: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BINNED_ORDER_BOOK_ADD_BINNED_ORDER_BOOKS: {
      console.log('binnedOrderBook Reducer', state, action);
      return Object.assign({}, state, {
        binnedOrderBooks: _.unionBy(action.binnedOrderBooks, state.binnedOrderBooks, 'id')
      });
    }
    default:
      return state;
  }
}
