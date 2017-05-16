import { ActionTypes, TimeRangePeriodTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';

let initialState = Immutable.fromJS({
  periodType: TimeRangePeriodTypes.LAST_7_DAYS,
  startDate: moment().subtract(6, 'days'),
  endDate: moment(),
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.MY_ACCOUNT_PAGE_SET_HISTORY_TIME_RANGE: {
      return state.merge({
        periodType: action.periodType,
        startDate: action.startDate,
        endDate: action.endDate,
      })
    }
    default:
      return state;
  }
}
