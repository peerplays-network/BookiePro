import React, { Component } from 'react';
import { LoadingStatus, AppBackgroundTypes } from '../../constants';
import { NavigateActions, AppActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import ConnectionErrorModal from '../Modal/ConnectionErrorModal';
import LogoutModal from '../Modal/LogoutModal';
import { AppUtils, SoftwareUpdateUtils } from '../../utility';
import TitleBar from './TitleBar';
import { I18n } from 'react-redux-i18n';
import Loading from '../Loading';

const isWindowsPlatform = AppUtils.isWindowsPlatform();
const titleBarHeight = isWindowsPlatform ? '32px' : '40px';

const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

// Import electron only if we are running inside electron (otherwise it will throw exception)
let electron;
if (isRunningInsideElectron) {
  electron = require('electron');
}


class App extends Component {
  constructor(props) {
    super(props);

    this.onConfirmLogout = this.onConfirmLogout.bind(this);
    this.onCancelLogout = this.onCancelLogout.bind(this);
    this.onConfirmSoftwareUpdate = this.onConfirmSoftwareUpdate.bind(this);
    this.onCancelSoftwareUpdate = this.onCancelSoftwareUpdate.bind(this);
    this.onClickTryAgainConnectionError = this.onClickTryAgainConnectionError.bind(this);
  }

  componentWillMount() {
    // Connect to blockchain
    this.props.connectToBlockchain();
  }

  onClickTryReconnecting() {
    this.props.connectToBlockchain();
  }

  onConfirmSoftwareUpdate() {
    if (this.props.isNeedHardUpdate) {
      // Close the app if it is hard update
      if (electron) {
        // Case of electron
        const electronWindow = electron.remote.getCurrentWindow();
        electronWindow.close();
      }
    }
    // Hide popup
    this.props.showSoftwareUpdatePopup(false);

  }

  onCancelSoftwareUpdate() {
    if (this.props.isNeedHardUpdate) {
      // Close the app if it is hard update
      if (electron) {
        // Case of electron
        const electronWindow = electron.remote.getCurrentWindow();
        electronWindow.close();
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

  render() {

    let softwareUpdateModal = (
        <SoftwareUpdateModal
          modalTitle={ this.props.displayText }
          closable={ !this.props.isNeedHardUpdate }
          visible={ this.props.isShowSoftwareUpdatePopup }
          onOk={ this.onConfirmSoftwareUpdate }
          onCancel={ this.onCancelSoftwareUpdate }
          latestVersion={ this.props.version }
        />
    );

    let logoutModal = (
      <LogoutModal
        onConfirmLogout={ this.onConfirmLogout }
        onCancelLogout={ this.onCancelLogout }
        visible={ this.props.isShowLogoutPopup }
        />
    );

    let connectionErrorModal = (
      <ConnectionErrorModal
        onClickTryAgain={ this.onClickTryAgainConnectionError }
        visible={ this.props.isShowConnectionErrorPopup }
        />
    );

    let content = null;
    // Show page based on blockchain connection loading status
    switch(this.props.connectToBlockchainLoadingStatus) {
      case LoadingStatus.LOADING: {
        content = <Loading />;
        break;
      }
      case LoadingStatus.DONE: {
        content = (
          this.props.children
        )
        break;
      }
      default: break;
    }
    // Use inline style to determine title bar height and top distance since they are depend on platform version
    const appContentStyle = {
      'top': titleBarHeight
    }

    const titleBarStyle = {
      'height': titleBarHeight,
      'minHeight': titleBarHeight
    }

    if (this.props.isTitleBarTransparent) {
      titleBarStyle['backgroundColor'] = 'transparent';
    }

    // Determine app background
    let appBackgroundClass = '';
    if (this.props.appBackgroundType === AppBackgroundTypes.SPORTS_BG) {
      appBackgroundClass = 'sportsbg';
    } else if (this.props.appBackgroundType === AppBackgroundTypes.GRADIENT_BG) {
      appBackgroundClass = 'gradientbg';
    }

    return (
      <div className={ 'app ' + appBackgroundClass }>
        <TitleBar isWindowsPlatform={ isWindowsPlatform } style={ titleBarStyle } />
        <div className='app-content' style={ appContentStyle }>
          { content }
        </div>
        { logoutModal }
        { softwareUpdateModal }
        { connectionErrorModal }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const app = state.get('app');
  const softwareUpdate = state.get('softwareUpdate');
  const i18n = state.get('i18n');
  const version = softwareUpdate.get('version');
  const locale = i18n.get('locale');
  const displayText = softwareUpdate.getIn(['displayText', locale]) || I18n.t('softwareUpdate.default');
  const isLoggedIn = state.getIn(['account','isLoggedIn']);
  const connectToBlockchainLoadingStatus = LoadingStatus.DONE;
  const isShowLogoutPopup = app.get('isShowLogoutPopup');
  const isShowSoftwareUpdatePopup = app.get('isShowSoftwareUpdatePopup');
  const isShowConnectionErrorPopup = connectToBlockchainLoadingStatus === LoadingStatus.ERROR;
  const isNeedHardUpdate = SoftwareUpdateUtils.isNeedHardUpdate(version);
  const isTitleBarTransparent = app.get('isTitleBarTransparent');
  const appBackgroundType = app.get('appBackgroundType');

  return {
    connectToBlockchainLoadingStatus,
    isLoggedIn,
    version,
    displayText,
    locale,
    isShowLogoutPopup,
    isShowSoftwareUpdatePopup,
    isShowConnectionErrorPopup,
    isNeedHardUpdate,
    appBackgroundType,
    isTitleBarTransparent
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    connectToBlockchain: AppActions.connectToBlockchain,
    showLogoutPopup: AppActions.showLogoutPopupAction,
    confirmLogout: AuthActions.confirmLogout,
    showSoftwareUpdatePopup: AppActions.showSoftwareUpdatePopupAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
