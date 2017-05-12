import { ActionTypes } from '../constants';


class MywagerActions {
  static setMywagerActiveTab(activeTab) {
    return {
      type: ActionTypes.MYWAGER_SET_ACTIVE_TAB,
      activeTab
    }
  }

  static setMywagerStartEndDate(startDate, endDate) {
    return {
      type: ActionTypes.MYWAGER_SET_START_END_DATE,
      startDate, endDate
    }
  }

  /**
   * Change active tab on Mywager tab change
   * activeTab - active Tab Key
   */
  static onTabChange(activeTab) {
    return (dispatch, getState) => {
      dispatch(MywagerActions.setMywagerActiveTab(activeTab));
    }
  }

  /**
   * set startDate and endDate for resolvedBets
   * startDate - daterange startDate for resolved bets
   * endDate - daterange endDate for resolved bets
   */
  static setStartEndDate(startDate, endDate){
    return (dispatch, getState) => {
      dispatch(MywagerActions.setMywagerStartEndDate(startDate, endDate));
    }
  }
}

export default MywagerActions;
