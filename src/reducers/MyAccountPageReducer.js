import { ActionTypes, TimeRangePeriodTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  periodType: TimeRangePeriodTypes.LAST_7_DAYS,
  customTimeRangeStartDate: null,
  customTimeRangeEndDate: null,
  exportPeriodType: TimeRangePeriodTypes.LAST_7_DAYS,
  exportCustomTimeRangeStartDate: null,
  exportCustomTimeRangeEndDate: null,
  transactionHistory: []
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
    case ActionTypes.MY_ACCOUNT_PAGE_SET_EXPORT_HISTORY_TIME_RANGE: {
      return state.merge({
        periodType: action.periodType,
        exportCustomTimeRangeStartDate: action.exportCustomTimeRangeStartDate,
        exportCustomTimeRangeEndDate: action.exportCustomTimeRangeEndDate,
      })
    }
    case ActionTypes.MY_ACCOUNT_PAGE_RESET_TIME_RANGE: {
      return state.merge({
        periodType: initialState.periodType,
        customTimeRangeStartDate: initialState.customTimeRangeStartDate,
        customTimeRangeEndDate: initialState.customTimeRangeEndDate,
        exportPeriodType: initialState.exportPeriodType,
        exportCustomTimeRangeStartDate: initialState.exportCustomTimeRangeStartDate,
        exportCustomTimeRangeEndDate: initialState.exportCustomTimeRangeEndDate,
      })
    }
    default:
      return state;
  }
}
