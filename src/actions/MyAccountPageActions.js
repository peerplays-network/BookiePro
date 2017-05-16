import { ActionTypes } from '../constants';


class MyAccountPageActions {
  static setHistoryTimeRange(periodType, startDate, endDate) {
    return {
      type: ActionTypes.MY_ACCOUNT_PAGE_SET_HISTORY_TIME_RANGE,
      periodType,
      startDate,
      endDate
    }
  }
}

export default MyAccountPageActions;
