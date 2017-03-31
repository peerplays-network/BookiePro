import { ActionTypes, LoadingStatus } from '../constants';
import FakeApi from '../communication/FakeApi';
import { ConnectionService } from '../services';
import SoftwareUpdateActions from './SoftwareUpdateActions';

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

  static setConnectionStatusAction(connectionStatus) {
    return {
      type: ActionTypes.APP_SET_CONNECTION_STATUS,
      connectionStatus
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

  static setBlockchainDynamicGlobalPropertyAction(blockchainDynamicGlobalProperty) {
    return {
      type: ActionTypes.APP_SET_BLOCKCHAIN_DYNAMIC_GLOBAL_PROPERTY,
      blockchainDynamicGlobalProperty
    }
  }

  static setBlockchainGlobalPropertyAction(blockchainGlobalProperty) {
    return {
      type: ActionTypes.APP_SET_BLOCKCHAIN_GLOBAL_PROPERTY,
      blockchainGlobalProperty
    }
  }

  static connectToBlockchain() {
    return (dispatch, getState) => {
      dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.LOADING));
      // Define callback whenever connection change
      const connectionStatusCallback = (connectionStatus) => {
        // Dispatch action if connection status is updated
        if (getState().getIn(['app', 'connectionStatus']) !== connectionStatus) {
          dispatch(AppPrivateActions.setConnectionStatusAction(connectionStatus));
        }
      };
      ConnectionService.connectToBlockchain(connectionStatusCallback).then(() => {
        // Sync with blockchain
        return ConnectionService.syncWithBlockchain(dispatch, getState);
      }).then(() => {
        // Listen to software update
        dispatch(SoftwareUpdateActions.listenToSoftwareUpdate());
        // Mark done
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
