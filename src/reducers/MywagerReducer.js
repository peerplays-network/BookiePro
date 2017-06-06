import { ActionTypes, TimeRangePeriodTypes, MyWagerTabTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  activeTab: MyWagerTabTypes.UNMATCHED_BETS,
  periodType: TimeRangePeriodTypes.LAST_7_DAYS,
  customTimeRangeStartDate: null,
  customTimeRangeEndDate: null,
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.MY_WAGER_SET_ACTIVE_TAB: {
      return state.merge({
        activeTab: action.activeTab
      });
    }
    case ActionTypes.MY_WAGER_SET_RESOLVED_BETS_TIME_RANGE: {
      return state.merge({
        periodType: action.periodType,
        customTimeRangeStartDate: action.customTimeRangeStartDate,
        customTimeRangeEndDate: action.customTimeRangeEndDate,
      })
    }
    default:
      return state;
  }
}
