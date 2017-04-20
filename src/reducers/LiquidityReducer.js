import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  totalMatchedBetsByBettingMarketGroupId: {},
  getTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.LIQUIDITY_SET_GET_TOTAL_MATCHED_BETS_BY_BETTING_MARKET_GROUP_IDS_LOADING_STATUS: {
      let nextState = state;
      action.bettingMarketGroupIds.forEach((bettingMarketGroupId) => {
        nextState = nextState.setIn(['getTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus', bettingMarketGroupId, action.loadingStatus]);
      });
      return nextState;
    }
    case ActionTypes.LIQUIDITY_ADD_OR_UPDATE_TOTAL_MATCHED_BETS_BY_BETTING_MARKET_GROUP_ID: {
      return state.mergeIn(['totalMatchedBetsByBettingMarketGroupId'], action.totalMatchedBetsByBettingMarketGroupId);
    }
    default:
      return state;
  }
}
