import { ActionTypes } from '../constants';


class MywagerActions {
  static setMywagerActiveTab(activeTab) {
    return {
      type: ActionTypes.MY_WAGER_SET_ACTIVE_TAB,
      activeTab
    }
  }

  /**
   * Set time range for resolved bets
   */
  static setResolvedBetsTimeRangeAction(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    return {
      type: ActionTypes.MY_WAGER_SET_RESOLVED_BETS_TIME_RANGE,
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    }
  }

}

export default MywagerActions;
