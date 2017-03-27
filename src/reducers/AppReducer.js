import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  isLoggedIn: false,
  getGlobalBettingStatisticsLoadingStatus: LoadingStatus.DEFAULT,
  connectToBlockchainLoadingStatus: LoadingStatus.DEFAULT,
  globalBettingStatistics: null
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.APP_SET_IS_LOGGED_IN: {
      return state.merge({
        isLoggedIn: action.isLoggedIn
      });
    }
    case ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_LOADING_STATUS: {
      return state.merge({
        getGlobalBettingStatisticsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.APP_SET_GLOBAL_BETTING_STATISTICS: {
      return state.merge({
        globalBettingStatistics: action.globalBettingStatistics
      });
    }
    case ActionTypes.APP_SET_CONNECT_TO_BLOCKCHAIN_LOADING_STATUS: {
      return state.merge({
        connectToBlockchainLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.ACCOUNT_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
