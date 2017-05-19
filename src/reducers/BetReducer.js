import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';
import { isUnmatchedBet } from './dataUtils';

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

  newUnmatchedBetsById: {},
  newMatchedBetsById: {},
  newResolvedBetsById: {},
  initMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  initMyBetsError: null,
  checkForNewMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  checkForNewMyBetsError: null,

  // TODO: The following should be deprecated and replaced with newUnmatchedBetsById, newMatchedBetsById, and newResolvedBetsById
  getOngoingBetsLoadingStatus: LoadingStatus.DEFAULT,
  getOngoingBetsError: null,
  getResolvedBetsLoadingStatus: LoadingStatus.DEFAULT,
  getResolvedBetsError: null,
  resolvedBetsById: {},
  matchedBetsById: {},
  unmatchedBetsById: {},


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
        newUnmatchedBetsById: action.myBets.unmatchedBetsById,
        newMatchedBetsById: action.myBets.matchedBetsById,
        newResolvedBetsById: action.myBets.resolvedBetsById
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
    case ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS: {
      // TODO: should be deprecated
      return state.merge({
        getOngoingBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS_EXPORT: {
      return state.merge({'resolvedBetsExportById': action.resolvedBetsExport});
    }
    case ActionTypes.BET_CLEAR_RESOLVED_BETS_EXPORT: {
      return state.merge({
        resolvedBetsExportById: {}
      });
    }
    case ActionTypes.BET_SET_GET_ONGOING_BETS_ERROR: {
        // TODO: should be deprecated
      return state.merge({
        getOngoingBetsError: action.error,
        getOngoingBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS: {
        // TODO: should be deprecated
      return state.merge({
        getResolvedBetsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_ERROR: {
        // TODO: should be deprecated
      return state.merge({
        getResolvedBetsError: action.error,
        getResolvedBetsLoadingStatus: LoadingStatus.ERROR
      });
    }
    case ActionTypes.BET_ADD_OR_UPDATE_ONGOING_BETS: {
        // TODO: should be deprecated
      let unmatchedBetsById = Immutable.Map();
      let matchedBetsById = Immutable.Map();
      // Split ongoing bets to unmatched and matched bets
      let newBetIds = Immutable.List();
      action.ongoingBets.forEach((bet) => {
        newBetIds = newBetIds.push(bet.get('id'));
        if (isUnmatchedBet(bet)) {
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
        // TODO: should be deprecated
      let nextState = state;
      action.betIds.forEach((betId) => {
        nextState = nextState.deleteIn(['unmatchedBetsById', betId]);
        nextState = nextState.deleteIn(['matchedBetsById', betId]);
      });
      return nextState;
    }
    case ActionTypes.BET_ADD_OR_UPDATE_RESOLVED_BETS: {
        // TODO: should be deprecated
      let resolvedBetsById = Immutable.Map();
      action.resolvedBets.forEach((bet) => {
        resolvedBetsById = resolvedBetsById.set(bet.get('id'), bet);
      });
      return state.mergeIn(['resolvedBetsById'], resolvedBetsById);
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_LOADING_STATUS: {
        // TODO: should be deprecated
      return state.merge({
        getResolvedBetsExportLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.BET_SET_GET_RESOLVED_BETS_EXPORT_ERROR: {
        // TODO: should be deprecated
      return state.merge({
        getResolvedBetsExportError: action.error,
        getResolvedBetsExportLoadingStatus: LoadingStatus.ERROR
      });
    }

    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
