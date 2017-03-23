import { ActionTypes } from '../constants';

const initialState = {
  transHistoryStatus: '',
  transactionHistory: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.TRANSACTION_HISTORY_LOADING_STATUS:
      return Object.assign({}, state, {
        transHistoryStatus: action.loadingStatus
      })
    case ActionTypes.ADD_TRANSACTION_HISTORY:
      return Object.assign({}, state, {
        transactionHistory: action.transactionHistory
      })
    default:
      return state;
  }
}
