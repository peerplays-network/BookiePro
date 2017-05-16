import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import moment from 'moment';

let initialState = Immutable.fromJS({
  activeTab: 'unmatchedBets',
  startDate: moment().subtract(6, 'days'),
  endDate: moment(),
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.MYWAGER_SET_ACTIVE_TAB: {
      return state.merge({
        activeTab: action.activeTab
      });
    }
    case ActionTypes.MYWAGER_SET_START_END_DATE: {
      return state.merge({
        startDate: action.startDate,
        endDate: action.endDate,
      })
    }
    default:
      return state;
  }
}
