import React, { PureComponent } from 'react';
import { LoadingStatus, AppBackgroundTypes, ConnectionStatus } from '../../constants';
import { NavigateActions, AppActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import ConnectionErrorModal from '../Modal/ConnectionErrorModal';
import LogoutModal from '../Modal/LogoutModal';
import { AppUtils, SoftwareUpdateUtils, ConnectionUtils } from '../../utility';
import TitleBar from './TitleBar';
import { I18n } from 'react-redux-i18n';
import Loading from '../Loading';
import LicenseScreen from '../LicenseScreen';

const isWindowsPlatform = AppUtils.isWindowsPlatform();
const titleBarHeight = isWindowsPlatform ? '32px' : '40px';
const LICENSE_SCREEN_DURATION = 2000; //2 seconds

// App content top depends on the title bar height
const appContentStyle = {
  'top': titleBarHeight
}

const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

// Import electron only if we are running inside electron (otherwise it will throw exception)
let electron;
if (isRunningInsideElectron) {
  electron = window.require('electron');
}


class App extends PureComponent {
  constructor(props) {
    super(props);

    this.onConfirmLogout = this.onConfirmLogout.bind(this);
    this.onCancelLogout = this.onCancelLogout.bind(this);
    this.onConfirmSoftwareUpdate = this.onConfirmSoftwareUpdate.bind(this);
    this.onCancelSoftwareUpdate = this.onCancelSoftwareUpdate.bind(this);
    this.onClickTryAgainConnectionError = this.onClickTryAgainConnectionError.bind(this);
    this.renderSoftwareUpdateModal = this.renderSoftwareUpdateModal.bind(this);
    this.renderLogoutModal = this.renderLogoutModal.bind(this);
    this.renderConnectionErrorModal = this.renderConnectionErrorModal.bind(this);
  }

  componentWillMount() {
    // Connect to blockchain
    this.props.connectToBlockchain();
  }

  componentDidMount() {
    setTimeout(this.props.hideLicenseScreen, LICENSE_SCREEN_DURATION);
  }

  onClickTryAgainConnectionError() {
    this.props.connectToBlockchain();
  }

  onConfirmSoftwareUpdate() {
    // Case of electron
    if (electron) {
      electron.shell.openExternal(this.props.updateLink);
      if (this.props.isNeedHardUpdate) {
      // Close the app if it is hard update              
        const electronWindow = electron.remote.getCurrentWindow();        
        if (SoftwareUpdateUtils.checkHardUpdateGracePeriod(this.props.updateDate, this.props.hardUpdateGracePeriod)) {
          electronWindow.close();
        }
      }
    }
    // Hide popup
    this.props.showSoftwareUpdatePopup(false);
  }

  onCancelSoftwareUpdate() {
    // Case of electron
    if (electron) {      
      // Close the app if it is hard update
      if (this.props.isNeedHardUpdate) {                   
        const electronWindow = electron.remote.getCurrentWindow();        
        if (SoftwareUpdateUtils.checkHardUpdateGracePeriod(this.props.updateDate, this.props.hardUpdateGracePeriod)) {
          electronWindow.close();
        }
      }
    }
    // Hide popup
    this.props.showSoftwareUpdatePopup(false);
  }  

  onConfirmLogout(skipLogoutPopupNextTime) {
    // Logout
    this.props.confirmLogout(skipLogoutPopupNextTime);
  }

  onCancelLogout() {
    // Hide modal
    this.props.showLogoutPopup(false);
  }

  renderSoftwareUpdateModal() {
    return (
        <SoftwareUpdateModal
          modalTitle={ this.props.displayText }
          version={ this.props.version }
          date={ this.props.updateDate }
          link={ this.props.updateLink }
          closable={ !this.props.isNeedHardUpdate }
          visible={ this.props.isShowSoftwareUpdatePopup }
          onOk={ this.onConfirmSoftwareUpdate }
          onCancel={ this.onCancelSoftwareUpdate }
        />
    );
  }

  renderConnectionErrorModal() {
    return (
      <ConnectionErrorModal
        onClickTryAgain={ this.onClickTryAgainConnectionError }
        visible={ this.props.isShowConnectionErrorPopup }
        //error={ this.props.connectToBlockchainError }
        error={ this.props.errorMsg }
        isConnectedToBlockchain={ this.props.isConnectedToBlockchain }
      />
    );
  }

  renderLogoutModal() {
    return (
      <LogoutModal
        onConfirmLogout={ this.onConfirmLogout }
        onCancelLogout={ this.onCancelLogout }
        visible={ this.props.isShowLogoutPopup }
        />
    );
  }

  render() {
    const { 
      children, 
      connectToBlockchainLoadingStatus, 
      appBackgroundType,
      isTitleBarTransparent, 
      showLicenseScreen 
    } = this.props;

    let content = null;
    if (showLicenseScreen) {
      content = <LicenseScreen />;
    }
    else if (connectToBlockchainLoadingStatus === LoadingStatus.LOADING) {
      content = <Loading />;
    } else{
      content = children;
    }

    // Determine app background
    let appBackgroundClass = '';
    if (appBackgroundType === AppBackgroundTypes.SPORTS_BG) {
      appBackgroundClass = 'sportsbg';
    } else if (appBackgroundType === AppBackgroundTypes.FIELD_BG) {
      appBackgroundClass = 'fieldbg';
    } else if (appBackgroundType === AppBackgroundTypes.AUDIENCE_BG) {
      appBackgroundClass = 'audiencebg';
    } else if (appBackgroundType === AppBackgroundTypes.LICENSE_BG) {
      appBackgroundClass = 'licensebg';
    } else {
      appBackgroundClass = 'gradientbg';
    }

    return (
      <div className={ 'app ' + appBackgroundClass }>
        <TitleBar
          isWindowsPlatform={ isWindowsPlatform }
          isTransparent={ isTitleBarTransparent }
          height={ titleBarHeight } />
        <div className='app-content' style={ appContentStyle }>
          { content }
        </div>
        { this.renderLogoutModal() }
        { this.renderSoftwareUpdateModal() }
        { this.renderConnectionErrorModal() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const app = state.get('app');
  const softwareUpdate = state.get('softwareUpdate');
  const i18n = state.get('i18n');
  const version = softwareUpdate.get('version');
  const hardUpdateGracePeriod = softwareUpdate.get('hardUpdateGracePeriod');
  const locale = i18n.get('locale');
  const displayText = I18n.t('softwareUpdate.default');
  const updateLink = softwareUpdate.get('link');
  const updateDate = softwareUpdate.get('date');
  const isLoggedIn = state.getIn(['account','isLoggedIn']);
  const connectToBlockchainLoadingStatus = app.get('connectToBlockchainLoadingStatus');
  const connectToBlockchainError = app.get('connectToBlockchainError');
  const isShowLogoutPopup = app.get('isShowLogoutPopup');
  const isShowSoftwareUpdatePopup = app.get('isShowSoftwareUpdatePopup');
  const isShowConnectionErrorPopup = connectToBlockchainLoadingStatus === LoadingStatus.ERROR;
  const isNeedHardUpdate = SoftwareUpdateUtils.isNeedHardUpdate(version);
  const isTitleBarTransparent = app.get('isTitleBarTransparent');
  const appBackgroundType = app.get('appBackgroundType');
  const isConnectedToBlockchain = state.getIn(['app', 'connectionStatus']) === ConnectionStatus.CONNECTED
  const showLicenseScreen = app.get('showLicenseScreen');
  const isConnectedToInternet = ConnectionUtils.isConnectedToInternet();
  const error = connectToBlockchainError;
  let errorMsg;
  
  if (error === LoadingStatus.ERROR_DESYNC) {
    errorMsg = I18n.t('connectionErrorModal.outOfSyncClock');
  } else {
    errorMsg = I18n.t('connectionErrorModal.explanation');
    if (error === LoadingStatus.ERROR_DISCONNECTED) {
      errorMsg = I18n.t('connectionErrorModal.disconnected');
    } else if (!isConnectedToInternet) {
      errorMsg = I18n.t('connectionErrorModal.noInternet');
    }
  }

  return {
    connectToBlockchainLoadingStatus,
    connectToBlockchainError,
    isConnectedToBlockchain,
    hardUpdateGracePeriod,
    isLoggedIn,
    version,
    displayText,
    locale,
    isShowLogoutPopup,
    isShowSoftwareUpdatePopup,
    isShowConnectionErrorPopup,
    isNeedHardUpdate,
    appBackgroundType,
    isTitleBarTransparent,
    showLicenseScreen,
    updateLink,
    updateDate,
    errorMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    connectToBlockchain: AppActions.connectToBlockchain,
    showLogoutPopup: AppActions.showLogoutPopupAction,
    confirmLogout: AuthActions.confirmLogout,
    showSoftwareUpdatePopup: AppActions.showSoftwareUpdatePopupAction,
    hideLicenseScreen: AppActions.hideLicenseScreen
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
