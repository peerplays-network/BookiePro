import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import _ from 'lodash';

let initialState = Immutable.fromJS({
  errorByBettingMarketGroupId: {},
  loadingStatusByBettingMarketGroupId: {},
  widgetTitle: '',
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_LOADING_STATUS: {
      return state.setIn(['loadingStatusByBettingMarketGroupId', action.bettingMarketGroupId], action.loadingStatus);
    }
    case ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_ERROR: {
      let nextState = state;
      nextState = state.setIn(['loadingStatusByBettingMarketGroupId', action.bettingMarketGroupId], LoadingStatus.ERROR);
      nextState = state.setIn(['errorByBettingMarketGroupId', action.bettingMarketGroupId], action.error);
      return nextState;
    }
    case ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_WIDGET_TITLE: {
      return state.set('widgetTitle', action.title);
    }
    default:
      return state;
  }
};
