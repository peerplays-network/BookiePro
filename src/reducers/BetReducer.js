import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  getOngoingBetsLoadingStatus: LoadingStatus.DEFAULT,
  getOngoingBetsError: null,
  getResolvedBetsLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsError: null,
  makeBetsLoadingStatus: LoadingStatus.DEFAULT,
  makeBetsError: null,
  editBetsByIdsLoadingStatus: {},
  editBetsErrorByBetId: {},
  cancelBetsByIdsLoadingStatus: {},
  cancelBetsErrorByBetId: {},
  unmatchedBetsById: {},
  matchedBetsById: {},
  resolvedBetsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS: {
      return state.merge({
        getOngoingBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_ONGOING_BETS_ERROR: {
      return state.merge({
        getOngoingBetsError: action.error,
        getOngoingBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS: {
      return state.merge({
        getResolvedBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_ERROR: {
      return state.merge({
        getResolvedBetsError: action.error,
        getResolvedBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_LOADING_STATUS: {
      return state.merge({
        makeBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_MAKE_BETS_ERROR: {
      return state.merge({
        makeBetsError: action.error,
        makeBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_SET_CANCEL_BETS_BY_IDS_LOADING_STATUS: {
      let cancelBetsByIdsLoadingStatus = Immutable.Map();
      action.betIds.forEach( betId => {
        cancelBetsByIdsLoadingStatus = cancelBetsByIdsLoadingStatus.set(betId, action.loadingStatus);
      })
      return state.mergeIn(['cancelBetsByIdsLoadingStatus'], cancelBetsByIdsLoadingStatus);
    }
    case ActionTypes.BET_SET_CANCEL_BETS_ERROR_BY_BET_ID: {
      let nextState = state;
      action.betIds.forEach((betId) => {
        nextState = nextState.setIn(['cancelBetsErrorByBetId', betId], action.error);
        nextState = nextState.setIn(['cancelBetsByIdsLoadingStatus', betId], LoadingStatus.ERROR);
      })
      return nextState;
    }
    case ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS: {
      let editBetsByIdsLoadingStatus = Immutable.Map();
      action.betIds.forEach( betId => {
        editBetsByIdsLoadingStatus = editBetsByIdsLoadingStatus.set(betId, action.loadingStatus);
      })
      return state.mergeIn(['editBetsByIdsLoadingStatus'], editBetsByIdsLoadingStatus);
    }
    case ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID: {
      let nextState = state;
      action.betIds.forEach((betId) => {
        nextState = nextState.setIn(['editBetsErrorByBetId', betId], action.error);
        nextState = nextState.setIn(['editBetsByIdsLoadingStatus', betId], LoadingStatus.ERROR);
      })
      return nextState;
    }
    case ActionTypes.BET_ADD_OR_UPDATE_ONGOING_BETS: {
      let unmatchedBetsById = Immutable.Map();
      let matchedBetsById = Immutable.Map();
      // Split ongoing bets to unmatched and matched bets
      let newBetIds = Immutable.List();
      action.ongoingBets.forEach((bet) => {
        newBetIds = newBetIds.push(bet.get('id'));
        if (bet.get('amount_to_bet') === bet.get('remaining_amount_to_bet')
          && bet.get('amount_to_win') === bet.get('remaining_amount_to_win')) {
          unmatchedBetsById = unmatchedBetsById.set(bet.get('id'), bet);
        } else {
          matchedBetsById = matchedBetsById.set(bet.get('id'), bet);
        }
      })
      let nextState = state;
      // Remove related old bets from existing unmatchedBetsById (in case unmatched bets become matched bets)
      // And from existing unmatchedBetsById (in case matched bets become unmatched bets) => although I think this one might not possible to happen
      newBetIds.forEach((newBetId) => {
        nextState = nextState.deleteIn(['unmatchedBetsById', newBetId]);
        nextState = nextState.deleteIn(['matchedBetsById', newBetId]);
      });
      // Merge the new data
      nextState = nextState.mergeIn(['unmatchedBetsById'], unmatchedBetsById);
      nextState = nextState.mergeIn(['matchedBetsById'], matchedBetsById);
      return nextState;
    }
    case ActionTypes.BET_REMOVE_ONGOING_BETS: {
      let nextState = state;
      action.betIds.forEach((betId) => {
        nextState = nextState.deleteIn(['unmatchedBetsById', betId]);
        nextState = nextState.deleteIn(['matchedBetsById', betId]);
      });
      return nextState;
    }
    case ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS: {
      let resolvedBetsById = Immutable.Map();
      action.resolvedBets.forEach((bet) => {
        resolvedBetsById = resolvedBetsById.set(bet.get('id'), bet);
      });
      return state.mergeIn(['resolvedBetsById'], resolvedBetsById);
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
