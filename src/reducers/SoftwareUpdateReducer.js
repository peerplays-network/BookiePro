import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.Map({
  referenceAccount: {},
  referenceAccountStatistics: {},
  version: '0.0.1', // minimum value, we not using null to avoid null checking
  displayText: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT: {
      return state.merge({
        referenceAccount: action.referenceAccount
      });
    }
    case ActionTypes.SOFTWARE_UPDATE_SET_REFERENCE_ACCOUNT_STATISTICS: {
      return state.merge({
        referenceAccountStatistics: action.referenceAccountStatistics
      });
    }
    case ActionTypes.SOFTWARE_UPDATE_SET_UPDATE_PARAMETER: {
      return state.merge({
        version: action.version,
        displayText: action.displayText,
        date: action.date,
        link: action.link
      });
    }
    default:
      return state;
  }
}
