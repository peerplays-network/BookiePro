import { ActionTypes, LoadingStatus } from '../constants';
import { BlockchainUtils } from '../utility';
const { getObjectIdInstanceNumber } = BlockchainUtils;
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  initTransactionHistoryError: null,
  initTransactionHistoryLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistoryByAccountId: {},
  getTransactionHistoryLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistory: [],
  getTransactionHistoryError: null,
  getTransactionHistoryExportLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistoryExport: [],
  getTransactionHistoryExportError: null,
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.HISTORY_SET_INIT_TRANSACTION_HISTORY_LOADING_STATUS: {
      return state.merge({
        initTransactionHistoryLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.HISTORY_APPEND_TRANSACTIONS_TO_THE_HISTORY: {
      let nextState = state;
      nextState = nextState.updateIn(['transactionHistoryByAccountId', action.accountId], (transactionHistory) => {
        // Create list if it doesnt exist yet
        if (!transactionHistory) transactionHistory = Immutable.List();

        let transactionsToBeAppended = action.transactions || Immutable.List();
        // Ensure that we don't append older (or duplicate) transactions to the history
        const currentLatestTxHistoryId = transactionHistory.getIn([0, 'id']);
        if (currentLatestTxHistoryId) {
          const currentLatestTxHistoryInstanceNumber = getObjectIdInstanceNumber(currentLatestTxHistoryId);
          transactionsToBeAppended = transactionsToBeAppended.filter((transaction) => {
            return getObjectIdInstanceNumber(transaction.get('id')) > currentLatestTxHistoryInstanceNumber;
          });
        }

        return transactionsToBeAppended.concat(transactionHistory);
      });
      return nextState;
    }
    case ActionTypes.HISTORY_SET_INIT_TRANSACTION_HISTORY_ERROR: {
      return state.merge({
        initTransactionHistoryError: action.error,
        initTransactionHistoryLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_LOADING_STATUS: {
      return state.merge({
        getTransactionHistoryLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.HISTORY_SET_TRANSACTION_HISTORY: {
      return state.merge({
        transactionHistory: action.transactionHistory
      });
    }
    case ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_ERROR: {
      return state.merge({
        getTransactionHistoryError: action.error,
        getTransactionHistoryLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_LOADING_STATUS_EXPORT: {
      return state.merge({
        getTransactionHistoryExportLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.HISTORY_SET_TRANSACTION_HISTORY_EXPORT: {
      return state.merge({
        transactionHistoryExport: action.transactionHistoryExport
      });
    }
    case ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_ERROR_EXPORT: {
      return state.merge({
        getTransactionHistoryExportError: action.error,
        getTransactionHistoryExportLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.AUTH_LOGOUT: {
      // Set next state to initial state
      let nextState = initialState;
      // However, keep the transaction history by account id (since we want to persist it)
      nextState = nextState.set('transactionHistoryByAccountId', state.transactionHistoryByAccountId);
      return nextState;
    }

    default:
      return state;
  }
}
