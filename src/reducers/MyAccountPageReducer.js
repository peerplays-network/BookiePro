import { ActionTypes, TimeRangePeriodTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  periodType: TimeRangePeriodTypes.LAST_7_DAYS,
  customTimeRangeStartDate: null,
  customTimeRangeEndDate: null,
  transactionHistory: [],
  transactionHistoryExportData: [],
  generateTransactionHistoryExportDataLoadingStatus: LoadingStatus.DEFAULT,
  generateTransactionHistoryExportDataError: null,
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.MY_ACCOUNT_PAGE_PREPEND_TRANSACTION_HISTORY: {
      const transactionHistoryToBePrepended = action.transactionHistory || Immutable.List();
      return state.update('transactionHistory', (transactionHistory) => {
        return transactionHistoryToBePrepended.concat(transactionHistory);
      })
    }
    case ActionTypes.MY_ACCOUNT_PAGE_SET_HISTORY_TIME_RANGE: {
      return state.merge({
        periodType: action.periodType,
        customTimeRangeStartDate: action.customTimeRangeStartDate,
        customTimeRangeEndDate: action.customTimeRangeEndDate,
      })
    }
    case ActionTypes.MY_ACCOUNT_PAGE_RESET_TIME_RANGE: {
      return state.merge({
        periodType: initialState.get('periodType'),
        customTimeRangeStartDate: initialState.get('customTimeRangeStartDate'),
        customTimeRangeEndDate: initialState.get('customTimeRangeEndDate'),
      })
    }
    case ActionTypes.MY_ACCOUNT_PAGE_SET_GENERATE_TRANSACTION_HISTORY_EXPORT_DATA_ERROR: {
      return state.merge({
        generateTransactionHistoryExportDataLoadingStatus: LoadingStatus.ERROR,
        generateTransactionHistoryExportDataError: action.error
      });
    }
    case ActionTypes.MY_ACCOUNT_PAGE_SET_GENERATE_TRANSACTION_HISTORY_EXPORT_DATA_LOADING_STATUS: {
      return state.merge({
        generateTransactionHistoryExportDataLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.MY_ACCOUNT_PAGE_SET_TRANSACTION_HISTORY_EXPORT_DATA: {
      return state.set('transactionHistoryExportData', action.transactionHistoryExportData);
    }
    case ActionTypes.MY_ACCOUNT_PAGE_RESET_TRANSACTION_HISTORY_EXPORT_DATA: {
      return state.merge({
        generateTransactionHistoryExportDataLoadingStatus: initialState.get('generateTransactionHistoryExportDataLoadingStatus'),
        generateTransactionHistoryExportDataError: initialState.get('generateTransactionHistoryExportDataLoadingStatus'),
        transactionHistoryExportData: initialState.get('transactionHistoryExportData')
      })
    }
    default:
      return state;
  }
}
