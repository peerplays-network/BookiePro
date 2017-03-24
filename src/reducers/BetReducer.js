import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getOngoingBetsLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsLoadingStatus: LoadingStatus.DEFAULT,
  unmatchedBets: [],
  matchedBets: [],
  resolvedBets: []
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS: {
      return state.merge({
        getOngoingBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS: {
      return state.merge({
        getResolvedBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      return state.merge({
        makeBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_CANCEL_BETS_LOADING_STATUS: {
      return state.merge({
        cancelBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_ADD_ONGOING_BETS: {
      const unmatchedBets = Immutable.List();
      const matchedBets = Immutable.List();
      // Split ongoing bets to unmatched and matched bets
      _.forEach(action.ongoingBets, (bet) => {
        if (bet.get('amount_to_bet') === bet.get('remaining_amount_to_bet')
          && bet.get('amount_to_win') === bet.get('remaining_amount_to_win')) {
          unmatchedBets.push(bet);
        } else {
          matchedBets.push(bet);
        }
      })

      return state.merge({
        matchedBets,
        unmatchedBets
      });
    }
    case ActionTypes.BET_ADD_RESOLVED_BETS: {
      return state.merge({
        resolvedBets: action.resolvedBets
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
