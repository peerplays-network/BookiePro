import { ActionTypes, LoadingStatus } from '../constants';
import FakeApi from '../communication/FakeApi';
import { ConnectionService } from '../services';

/**
 * Private actions
 */
class AppPrivateActions {
  static setConnectToBlockchainLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.APP_SET_CONNECT_TO_BLOCKCHAIN_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGlobalBettingStatisticsAction(globalBettingStatistics) {
    return {
      type: ActionTypes.APP_SET_GLOBAL_BETTING_STATISTICS,
      globalBettingStatistics
    }
  }

  static setGetGlobalBettingStatisticsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class AppActions {
  static setIsLoggedInAction(isLoggedIn) {
    return {
      type: ActionTypes.APP_SET_IS_LOGGED_IN,
      isLoggedIn
    }
  }

  static connectToBlockchain() {
    return (dispatch) => {
      dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.LOADING));
      // Define websocketSubscriber
      const wsStatusCallback = (message) => {
        switch (message) {
          case 'open': {
            console.log('Websocket connection open');
            break;
          }
          case 'reconnect': {
            console.log('Websocket connection reconnect');
            break;
          }
          case 'error': {
            console.log('Websocket connection error');
            break;
          }
          case 'closed': {
            console.log('Websocket connection close');
            break;
          }
          default: break;
        }
      };
      ConnectionService.connectToBlockchain(wsStatusCallback).then(() => {
        // Sync with blockchain
        return ConnectionService.syncWithBlockchain();
      }).then(() => {
        dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.DONE));
      }).catch(() => {
        dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.ERROR));
      });
    }
  }

  static getGlobalBettingStatistics() {
    return (dispatch) => {
      dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: replace with actual blockchain call later
      FakeApi.getGlobalBettingStatistics().then((globalBettingStatistics) => {
        dispatch(AppPrivateActions.setGlobalBettingStatisticsAction(globalBettingStatistics));
        dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }
 }

export default AppActions;
