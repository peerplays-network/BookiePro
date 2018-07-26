import {ActionTypes} from '../constants';
import {LoadingStatus} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  editBetsByIdsLoadingStatus: {},
  editBetsErrorByBetId: {},
  cancelBetsByIdsLoadingStatus: {},
  cancelBetsErrorByBetId: {},
  makeBetsLoadingStatus: LoadingStatus.DEFAULT,
  makeBetsError: null,

  unmatchedBetsById: {},
  matchedBetsById: {},
  resolvedBetsById: {},
  initMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  initMyBetsError: null,
  checkForNewMyBetsLoadingStatus: LoadingStatus.DEFAULT,
  checkForNewMyBetsError: null
});

export default function(state = initialState, action) {
  switch (action.type) {
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
      });
    }

    case ActionTypes.BET_UPDATE_MY_BETS: {
      return state.merge({
        unmatchedBetsById: action.myBets.unmatchedBetsById,
        matchedBetsById: action.myBets.matchedBetsById,
        resolvedBetsById: action.myBets.resolvedBetsById
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
      action.betIds.forEach(betId => {
        cancelBetsByIdsLoadingStatus = cancelBetsByIdsLoadingStatus.set(
          betId,
          action.loadingStatus
        );
      });
      return state.mergeIn(['cancelBetsByIdsLoadingStatus'], cancelBetsByIdsLoadingStatus);
    }

    case ActionTypes.BET_SET_CANCEL_BETS_ERROR_BY_BET_ID: {
      let nextState = state;
      action.betIds.forEach(betId => {
        nextState = nextState.setIn(['cancelBetsErrorByBetId', betId], action.error);
        nextState = nextState.setIn(['cancelBetsByIdsLoadingStatus', betId], LoadingStatus.ERROR);
      });
      return nextState;
    }

    case ActionTypes.BET_SET_EDIT_BETS_BY_IDS_LOADING_STATUS: {
      let editBetsByIdsLoadingStatus = Immutable.Map();
      action.betIds.forEach(betId => {
        editBetsByIdsLoadingStatus = editBetsByIdsLoadingStatus.set(betId, action.loadingStatus);
      });
      return state.mergeIn(['editBetsByIdsLoadingStatus'], editBetsByIdsLoadingStatus);
    }

    case ActionTypes.BET_SET_EDIT_BETS_ERROR_BY_BET_ID: {
      let nextState = state;
      action.betIds.forEach(betId => {
        nextState = nextState.setIn(['editBetsErrorByBetId', betId], action.error);
        nextState = nextState.setIn(['editBetsByIdsLoadingStatus', betId], LoadingStatus.ERROR);
      });
      return nextState;
    }

    case ActionTypes.AUTH_LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
}
