import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  editBetsByIdsLoadingStatus: {},
  editBetsErrorByBetId: {},
  cancelBetsByIdsLoadingStatus: {},
  cancelBetsErrorByBetId: {},
  makeBetsLoadingStatus: LoadingStatus.DEFAULT,
  makeBetsError: null,

  getResolvedBetsExportLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsExportError: null,
  resolvedBetsExportById: {},

  unmatchedBetsById: {},
  matchedBetsById: {},
  resolvedBetsById: {},
  initMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  initMyBetsError: null,
  checkForNewMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  checkForNewMyBetsError: null,

});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BET_INIT_MY_BETS_LOADING_STATUS: {
      return state.merge({
        initMyBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_INIT_MY_BETS_ERROR: {
      return state.merge({
        initMyBetsError: action.error,
        initMyBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_LOADING_STATUS: {
      return state.merge({
        checkForNewMyBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_CHECK_FOR_NEW_MY_BETS_ERROR: {
      return state.merge({
        checkForNewMyBetsError: action.error,
        checkForNewMyBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_SET_MY_BETS: {
      return state.merge({
        unmatchedBetsById: action.myBets.unmatchedBetsById,
        matchedBetsById: action.myBets.matchedBetsById,
        resolvedBetsById: action.myBets.resolvedBetsById
      })
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_LOADING_STATUS: {
      return state.merge({
        getResolvedBetsExportLoadingStatus: action.loadingStatus
      })
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_ERROR: {
      return state.merge({
        getResolvedBetsExportError: action.error,
        getResolvedBetsExportLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_UPDATE_MY_BETS: {
      let unmatchedBetsById = state.unmatchedBetsById;
      let matchedBetsById = state.matchedBetsById;
      let resolvedBetsById = state.resolvedBetsById;

      // Update the data
      action.myBets.unmatchedBetsById.forEach((unmatchedBet, id) => {
        unmatchedBetsById = unmatchedBetsById.set(id, unmatchedBet)
      })
      action.myBets.matchedBetsById.forEach((matchedBet, id) => {
        const matchedAmount = matchedBet.get('matched_bet_amount');
        // Update unmatched portion
        let unmatchedBet = unmatchedBetsById.get(id);
        if (unmatchedBet) {
          const unmatchedAmount = unmatchedBet.get('unmatched_bet_amount');
          const updatedUnmatchedAmount = unmatchedAmount - matchedAmount;
          unmatchedBet = unmatchedBet.set('unmatched_bet_amount', updatedUnmatchedAmount);
          unmatchedBetsById = unmatchedBetsById.set(id, unmatchedBet);
        }
        matchedBetsById = matchedBetsById.set(id, matchedBet);
      })
      action.myBets.resolvedBetsById.forEach((resolvedBet, id) => {
        // Remove from resolved bets
        matchedBetsById = matchedBetsById.delete(id);
        resolvedBetsById = resolvedBetsById.set(id, resolvedBet)
      })
      return state.merge({
        unmatchedBetsById: unmatchedBetsById,
        matchedBetsById: matchedBetsById,
        resolvedBetsById: resolvedBetsById
      })
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

    case ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS_EXPORT: {
      return state.merge({'resolvedBetsExportById': action.resolvedBetsExport});
    }
    case ActionTypes.BET_CLEAR_RESOLVED_BETS_EXPORT: {
      return state.merge({
        resolvedBetsExportById: {}
      });
    }
    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
