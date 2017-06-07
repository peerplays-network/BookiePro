import { ActionTypes, LoadingStatus } from '../constants';
import { HistoryService } from '../services';

class MyAccountPagePrivateActions {
  static prependTransactionHistory(transactionHistory) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_PREPEND_TRANSACTION_HISTORY,
      transactionHistory
    }
  }

  static setGenerateTransactionHistoryExportDataLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_GENERATE_TRANSACTION_HISTORY_EXPORT_DATA_LOADING_STATUS,
      loadingStatus
    }
  }

  static setTransactionHistoryExportDataAction(transactionHistoryExportData) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_TRANSACTION_HISTORY_EXPORT_DATA,
      transactionHistoryExportData
    }
  }

  static setGenerateTransactionHistoryExportDataErrorAction(error) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_GENERATE_TRANSACTION_HISTORY_EXPORT_DATA_ERROR,
      error
    }
  }

}

class MyAccountPageActions {
  static resetTransactionHistoryExportDataAction() {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_RESET_TRANSACTION_HISTORY_EXPORT_DATA,
    }
  }

  static resetTimeRange() {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_RESET_TIME_RANGE
    }
  }
  static setHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_HISTORY_TIME_RANGE,
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    }
  }

  static generateTransactionHistoryExportData() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        // Set loading status
        dispatch(MyAccountPagePrivateActions.setGenerateTransactionHistoryExportDataLoadingStatusAction(LoadingStatus.LOADING));

        const periodType = getState().getIn(['mywager', 'periodType']);
        const customTimeRangeStartDate = getState().getIn(['mywager', 'customTimeRangeStartDate']);
        const customTimeRangeEndDate = getState().getIn(['mywager', 'customTimeRangeEndDate']);

        const rawHistory = getState().getIn(['rawHistory', 'rawHistoryByAccountId', accountId]);
        // Create transaction history
        const transactionHistory = HistoryService.convertRawHistoryToTransactionHistory(getState(), rawHistory);
        // Filter
        const filteredTransactionHistory = HistoryService.filterTransactionHistoryGivenTimeRange(transactionHistory,
                                                                                                   periodType,
                                                                                                   customTimeRangeStartDate,
                                                                                                   customTimeRangeEndDate);
        // Convert to export data
        const transactionHistoryExportData = HistoryService.convertTransactionHistoryToTransactionHistoryExportData(getState(),
                                                                                                                    filteredTransactionHistory);
        // Set export data
        dispatch(MyAccountPagePrivateActions.setTransactionHistoryExportDataAction(transactionHistoryExportData));
        // Set loading status
        dispatch(MyAccountPagePrivateActions.setGenerateTransactionHistoryExportDataLoadingStatusAction(LoadingStatus.DONE));
      }
    }
  }

  static updateTransactionHistory(rawHistoryDelta) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        const transactionHistory = HistoryService.convertRawHistoryToTransactionHistory(getState(), rawHistoryDelta);
        dispatch(MyAccountPagePrivateActions.prependTransactionHistory(transactionHistory));
      }
    }
  }

  static initTransactionHistory() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        const rawHistory = getState().getIn(['rawHistory', 'rawHistoryByAccountId', accountId]);
        const transactionHistory = HistoryService.convertRawHistoryToTransactionHistory(getState(), rawHistory);
        dispatch(MyAccountPagePrivateActions.prependTransactionHistory(transactionHistory));
      }
    }
  }
}

export default MyAccountPageActions;
