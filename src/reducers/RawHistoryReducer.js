import { ActionTypes, LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  initRawHistoryError: null,
  initRawHistoryLoadingStatus: LoadingStatus.DEFAULT,
  rawHistoryByAccountId: {},
  checkForNewRawHistoryError: null,
  checkForNewRawHistoryLoadingStatus: LoadingStatus.DEFAULT,
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.RAW_HISTORY_PREPEND_RAW_TRANSACTIONS_TO_RAW_HISTORY: {
      let nextState = state;
      nextState = nextState.updateIn(['rawHistoryByAccountId', action.accountId], (rawHistory) => {
        // Create list if it doesnt exist yet
        if (!rawHistory) rawHistory = Immutable.List();

        let transactionsToBePrepended = action.transactions || Immutable.List();
        return transactionsToBePrepended.concat(rawHistory);
      });

      return nextState;
    }
    case ActionTypes.RAW_HISTORY_SET_INIT_RAW_HISTORY_LOADING_STATUS: {
      return state.merge({
        initRawHistoryLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.RAW_HISTORY_SET_CHECK_FOR_NEW_RAW_HISTORY_ERROR: {
      return state.merge({
        checkForNewRawHistoryError: action.error,
        checkForNewRawHistoryLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.RAW_HISTORY_SET_CHECK_FOR_NEW_RAW_HISTORY_LOADING_STATUS: {
      return state.merge({
        checkForNewRawHistoryLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.RAW_HISTORY_SET_INIT_RAW_HISTORY_ERROR: {
      return state.merge({
        initRawHistoryError: action.error,
        initRawHistoryLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.AUTH_LOGOUT: {
      // Set next state to initial state
      let nextState = initialState;
      // However, keep the transaction history by account id (since we want to persist it)
      const rawHistoryByAccountId = state.rawHistoryByAccountId.filter( (v, k) => k === action.accountId) || Immutable.Map();
      nextState = nextState.set('rawHistoryByAccountId', rawHistoryByAccountId);
      return nextState;
    }

    default:
      return state;
  }
}
