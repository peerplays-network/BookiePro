import React, { Component } from 'react';
import InitError from '../InitError';
import { LoadingStatus } from '../../constants';
import { NavigateActions, AppActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import LogoutModal from '../Modal/LogoutModal';
import { AppUtils, SoftwareUpdateUtils } from '../../utility';
import TitleBar from './TitleBar';
import { I18n } from 'react-redux-i18n';

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
    this.state = {
      needHardUpdate : false,
      newVersionModalVisible: false
    };
    this.onConfirmLogout = this.onConfirmLogout.bind(this);
    this.onCancelLogout = this.onCancelLogout.bind(this);
    this.onConfirmSoftwareUpdate = this.onConfirmSoftwareUpdate.bind(this);
    this.onCancelSoftwareUpdate = this.onCancelSoftwareUpdate.bind(this);
  }

  componentWillMount() {
    // Connect to blockchain
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

  okWillCloseModal(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });
  }

  okWillCloseApp(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });

    if ( this.state.needHardUpdate){
      const remote = require('electron').remote;

      var window = remote.getCurrentWindow();
      window.close();
    }
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

    let content = null;
    // Show page based on blockchain connection loading status
    switch(this.props.connectToBlockchainLoadingStatus) {
      case LoadingStatus.ERROR: {
        content = <InitError/>
        break;
      }
      case LoadingStatus.DONE: {
        content = (
          this.props.children
        )
        break;
      }
      default: {
        content = (
          <span>{ 'Connecting to blockchain...' }</span>
        );
      }
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

    return (
      <div className='app'>
        <TitleBar isWindowsPlatform={ isWindowsPlatform } style={ titleBarStyle } />
        <div className='app-content'>
          { content }
        </div>
        { logoutModal }
        { softwareUpdateModal }
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
  const connectToBlockchainLoadingStatus = app.get('connectToBlockchainLoadingStatus');
  const isShowLogoutPopup = app.get('isShowLogoutPopup');
  const isShowSoftwareUpdatePopup = app.get('isShowSoftwareUpdatePopup');
  const isNeedHardUpdate = SoftwareUpdateUtils.isNeedHardUpdate(version);
  const isTitleBarTransparent = app.get('isTitleBarTransparent');

  return {
    connectToBlockchainLoadingStatus,
    isLoggedIn,
    version,
    displayText,
    locale,
    isShowLogoutPopup,
    isShowSoftwareUpdatePopup,
    isNeedHardUpdate,
    isTitleBarTransparent
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    connectToBlockchain: AppActions.connectToBlockchain,
    showLogoutPopup: AppActions.showLogoutPopupAction,
    confirmLogout: AuthActions.confirmLogout,
    showSoftwareUpdatePopup: AppActions.showSoftwareUpdatePopupAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
