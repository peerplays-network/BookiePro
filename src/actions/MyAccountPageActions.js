import { ActionTypes } from '../constants';
import { HistoryService } from '../services';

class MyAccountPagePrivateActions {
  static prependTransactionHistory(transactionHistory) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_PREPEND_TRANSACTION_HISTORY,
      transactionHistory
    }
  }
}

class MyAccountPageActions {
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
  static setExportHistoryTimeRange(exportPeriodType, exportCustomTimeRangeStartDate, exportCustomTimeRangeEndDate) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_EXPORT_HISTORY_TIME_RANGE,
      exportPeriodType,
      exportCustomTimeRangeStartDate,
      exportCustomTimeRangeEndDate
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
        const rawHistory = getState().getIn(['history', 'transactionHistoryByAccountId', accountId]);
        const transactionHistory = HistoryService.convertRawHistoryToTransactionHistory(getState(), rawHistory);
        dispatch(MyAccountPagePrivateActions.prependTransactionHistory(transactionHistory));
      }
    }
  }
}

export default MyAccountPageActions;
