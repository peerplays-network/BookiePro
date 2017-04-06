import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getOngoingBetsLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsLoadingStatus: LoadingStatus.DEFAULT,
  makeBetsLoadingStatus: LoadingStatus.DEFAULT,
  editBetsByIdsLoadingStatus: {},
  cancelBetsByIdsLoadingStatus: {},
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
    case ActionTypes.BET_SET_CANCEL_BETS_BY_IDS_LOADING_STATUS: {
      let cancelBetsByIdsLoadingStatus = Immutable.Map();
      action.betIds.forEach( betId => {
        cancelBetsByIdsLoadingStatus = cancelBetsByIdsLoadingStatus.set(betId, action.loadingStatus);
      })
      return state.mergeIn(['cancelBetsByIdsLoadingStatus'], cancelBetsByIdsLoadingStatus);
    }
    case ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS: {
      let editBetsByIdsLoadingStatus = Immutable.Map();
      action.betIds.forEach( betId => {
        editBetsByIdsLoadingStatus = editBetsByIdsLoadingStatus.set(betId, action.loadingStatus);
      })
      return state.mergeIn(['editBetsByIdsLoadingStatus'], editBetsByIdsLoadingStatus);
    }
    case ActionTypes.BET_SET_ONGOING_BETS: {
      let unmatchedBets = Immutable.List();
      let matchedBets = Immutable.List();
      // Split ongoing bets to unmatched and matched bets
      action.ongoingBets.forEach((bet) => {
        if (bet.get('amount_to_bet') === bet.get('remaining_amount_to_bet')
          && bet.get('amount_to_win') === bet.get('remaining_amount_to_win')) {
          unmatchedBets = unmatchedBets.push(bet);
        } else {
          matchedBets = matchedBets.push(bet);
        }
      })
      return state.merge({
        matchedBets,
        unmatchedBets
      });
    }
    case ActionTypes.BET_SET_RESOLVED_BETS: {
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
