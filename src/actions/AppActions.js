import { ActionTypes, LoadingStatus, Config, ConnectionStatus } from '../constants';
import { ConnectionService, CommunicationService } from '../services';
import SoftwareUpdateActions from './SoftwareUpdateActions';
import AuthActions from './AuthActions';
import { I18n } from 'react-redux-i18n';
import log from 'loglevel';

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

  static setGetGlobalBettingStatisticsErrorAction(error) {
    return {
      type: ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_ERROR,
      error
    }
  }

  static setConnectToBlockchainErrorAction(error) {
    return {
      type: ActionTypes.APP_SET_CONNECT_TO_BLOCKCHAIN_ERROR,
      error
    }
  }

  static setConnectionStatusAction(connectionStatus) {
    return {
      type: ActionTypes.APP_SET_CONNECTION_STATUS,
      connectionStatus
    }
  }

  static setGatewayAccountAction(gatewayAccount) {
    return {
      type: ActionTypes.APP_SET_GATEWAY_ACCOUNT,
      gatewayAccount
    }
  }

  static hideLicenseScreen() {
    return {
      type: ActionTypes.APP_HIDE_LICENSE_SCREEN,
    }
  }
}

/**
 * Public actions
 */
class AppActions {
  /**
   * Set app background
   */
  static setAppBackgroundAction(appBackgroundType) {
    return {
      type: ActionTypes.APP_SET_APP_BACKGROUND,
      appBackgroundType
    }
  }
  /**
   * Action to set title bar transparency
   */
  static setTitleBarTransparency(isTitleBarTransparent) {
    return {
      type: ActionTypes.APP_SET_TITLE_BAR_TRANSPARENCY,
      isTitleBarTransparent
    }
  }

  /**
   * Action to show logout popup
   */
  static showNotificationCardAction(isShowNotificationCard) {
    return {
      type: ActionTypes.APP_SHOW_NOTIFICATION_CARD,
      isShowNotificationCard
    }
  }

  /**
   * Action to show logout popup
   */
  static showLogoutPopupAction(isShowLogoutPopup) {
    return {
      type: ActionTypes.APP_SHOW_LOGOUT_POPUP,
      isShowLogoutPopup
    }
  }

  /**
   * Action to show software update popup
   */
  static showSoftwareUpdatePopupAction(isShowSoftwareUpdatePopup) {
    return {
      type: ActionTypes.APP_SHOW_SOFTWARE_UPDATE_POPUP,
      isShowSoftwareUpdatePopup
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

        // If we are offline, logout the user.
        if (connectionStatus === ConnectionStatus.DISCONNECTED) {
          // To force a resubscription to all the required information, push the user to the start of the app again.  
          dispatch(AuthActions.confirmLogout());
          
          // Show the prompt that they've been disconnected and to try again.
          dispatch(AppPrivateActions.setConnectToBlockchainErrorAction(LoadingStatus.ERROR_DISCONNECTED));
          dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.ERROR));
        }

      };
      ConnectionService.connectToBlockchain(connectionStatusCallback).then(() => {
        // Sync with blockchain
        return CommunicationService.syncWithBlockchain(dispatch, getState);
      }).then(() => {
        // Listen to software update
        return dispatch(SoftwareUpdateActions.listenToSoftwareUpdate());
      }).then(() => {
        // Fetch gateway account
        const gatewayAccountName = Config.gatewayAccountName;
        return CommunicationService.getFullAccount(gatewayAccountName);
      }).then((gatewayFullAccount) => {
        if (gatewayFullAccount) {
          const gatewayAccount = gatewayFullAccount.get('account');
          dispatch(AppPrivateActions.setGatewayAccountAction(gatewayAccount));
        }
        log.info('Connected to blockchain.');
        // Push the user back to the login.
        dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.DONE));
        dispatch(AuthActions.autoLogout());

      }).catch((error) => {
        log.error('Fail to connect to blockchain', error);
        let desyncError = I18n.t('connectionErrorModal.outOfSyncClock');
        if (error.message === desyncError){
          dispatch(AppPrivateActions.setConnectToBlockchainErrorAction(LoadingStatus.ERROR_DESYNC));
        } else {
          // Fail to connect/ sync/ listen to software update, close connection to the blockchain
          ConnectionService.closeConnectionToBlockchain();
          dispatch(AppPrivateActions.setConnectToBlockchainErrorAction(error));          
        }

        dispatch(AppPrivateActions.setConnectToBlockchainLoadingStatusAction(LoadingStatus.ERROR));
      });
    }
  }

  static getGlobalBettingStatistics() {
    return (dispatch) => {
      dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.LOADING));
      return CommunicationService.getGlobalBettingStatistics().then((globalBettingStatistics) => {
        log.debug('Get global betting statistics succeed.');
        dispatch(AppPrivateActions.setGlobalBettingStatisticsAction(globalBettingStatistics));
        dispatch(AppPrivateActions.setGetGlobalBettingStatisticsLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Fail to get global betting statistics', error);
        dispatch(AppPrivateActions.setGetGlobalBettingStatisticsErrorAction(error));
      });
    }
  }

  static hideLicenseScreen() {
    return (dispatch) => {
      dispatch(AppPrivateActions.hideLicenseScreen());
    }
  }
 }

export default AppActions;
