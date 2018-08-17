import { ActionTypes, LoadingStatus, ConnectionStatus, AppBackgroundTypes, BookieModes } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  appBackgroundType: AppBackgroundTypes.GRADIENT_BG,
  getGlobalBettingStatisticsLoadingStatus: LoadingStatus.DEFAULT,
  getGlobalBettingStatisticsError: null,
  connectToBlockchainLoadingStatus: LoadingStatus.DEFAULT,
  connectToBlockchainError: null,
  globalBettingStatistics: {},
  connectionStatus: ConnectionStatus.DISCONNECTED,
  blockchainDynamicGlobalProperty: {},
  blockchainGlobalProperty: {},
  isShowLogoutPopup: false,
  isShowSoftwareUpdatePopup: false,
  isShowNotificationCard: false,
  isTitleBarTransparent: true,
  gatewayAccount: {},
  showLicenseScreen: false,
  bookMode: BookieModes.EXCHANGE
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.APP_SET_APP_BACKGROUND: {
      return state.merge({
        appBackgroundType: action.appBackgroundType
      });
    }
    case ActionTypes.APP_SHOW_NOTIFICATION_CARD: {
      return state.merge({
        isShowNotificationCard: action.isShowNotificationCard
      });
    }
    case ActionTypes.APP_SHOW_SOFTWARE_UPDATE_POPUP: {
      return state.merge({
        isShowSoftwareUpdatePopup: action.isShowSoftwareUpdatePopup
      });
    }
    case ActionTypes.APP_SET_TITLE_BAR_TRANSPARENCY: {
      return state.merge({
        isTitleBarTransparent: action.isTitleBarTransparent
      })
    }
    case ActionTypes.APP_SET_BLOCKCHAIN_DYNAMIC_GLOBAL_PROPERTY: {
      return state.merge({
        blockchainDynamicGlobalProperty: action.blockchainDynamicGlobalProperty
      });
    }
    case ActionTypes.APP_SET_BLOCKCHAIN_GLOBAL_PROPERTY: {
      return state.merge({
        blockchainGlobalProperty: action.blockchainGlobalProperty
      });
    }
    case ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_LOADING_STATUS: {
      return state.merge({
        getGlobalBettingStatisticsLoadingStatus: action.loadingStatus
      });
    }
    case ActionTypes.APP_SET_GET_GLOBAL_BETTING_STATISTICS_ERROR: {
      return state.merge({
        getGlobalBettingStatisticsError: action.error,
        getGlobalBettingStatisticsLoadingStatus: LoadingStatus.ERROR
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
    case ActionTypes.APP_SET_CONNECT_TO_BLOCKCHAIN_ERROR: {
      return state.merge({
        connectToBlockchainError: action.error
      });
    }
    case ActionTypes.APP_SET_CONNECTION_STATUS: {
      return state.merge({
        connectionStatus: action.connectionStatus
      });
    }
    case ActionTypes.APP_SHOW_LOGOUT_POPUP: {
      return state.merge({
        isShowLogoutPopup: action.isShowLogoutPopup
      });
    }
    case ActionTypes.APP_SET_GATEWAY_ACCOUNT: {
      return state.merge({
        gatewayAccount: action.gatewayAccount
      });
    }
    case ActionTypes.APP_HIDE_LICENSE_SCREEN: {
      return state.merge({
        showLicenseScreen: false   // It is a one time thing
      });
    }
    case ActionTypes.APP_SET_BOOK_MODE: {
      return state.merge({
        bookMode: action.mode
      });
    }
    default:
      return state;
  }
}
