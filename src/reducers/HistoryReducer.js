import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getTransactionHistoryLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistory: [],
  getTransactionHistoryError: null,
  getTransactionHistoryExportLoadingStatus: LoadingStatus.DEFAULT,
  transactionHistoryExport: [],
  getTransactionHistoryExportError: null,
});

export default function (state = initialState, action) {
  switch(action.type) {
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

    default:
      return state;
  }
}
