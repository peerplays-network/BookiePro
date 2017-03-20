import { ActionTypes, LoadingStatus } from '../constants';

const initialState = {
  isLoggedIn: false,
  getGlobalBettingStatisticsLoadingStatus: LoadingStatus.DEFAULT,
  globalBettingStatistics: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.APP_SET_ACCOUNT: {
      const account = action.account;
      return Object.assign({}, state, { account });
    }
    case ActionTypes.APP_SET_IS_LOGGED_IN: {
      const isLoggedIn = action.isLoggedIn;
      return Object.assign({}, state, { isLoggedIn });
    }
    case ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_LOADING_STATUS: {
      return Object.assign({}, state, {
        getGlobalBettingStatisticsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.APP_SET_GLOBAL_BETTING_STATISTICS: {
      return Object.assign({}, state, {
        globalBettingStatistics: action.globalBettingStatistics
      });
    }

    default:
      return state;
  }
}
