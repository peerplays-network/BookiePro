import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';

let initialState = {
  getOngoingBetsLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsLoadingStatus: LoadingStatus.DEFAULT,
  unmatchedBets: [],
  matchedBets: [],
  resolvedBets: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getOngoingBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getResolvedBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      return Object.assign({}, state, {
        makeBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_CANCEL_BETS_LOADING_STATUS: {
      return Object.assign({}, state, {
        cancelBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_ONGOING_BETS: {
      const unmatchedBets = [];
      const matchedBets = [];
      // Split ongoing bets to unmatched and matched bets
      _.forEach(action.ongoingBets, (bet) => {
        if (bet.amount_to_bet === bet.remaining_amount_to_bet
          && bet.amount_to_win === bet.remaining_amount_to_win) {
          unmatchedBets.push(bet);
        } else {
          matchedBets.push(bet);
        }
      })
      return Object.assign({}, state, {
        matchedBets,
        unmatchedBets
      });
    }
    case ActionTypes.BET_SET_RESOLVED_BETS: {
      return Object.assign({}, state, {
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
