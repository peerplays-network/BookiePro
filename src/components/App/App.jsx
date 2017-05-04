import React, { Component } from 'react';
import InitError from '../InitError';
import { LoadingStatus, Config } from '../../constants';
import { NavigateActions, AppActions, AccountActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import LogoutModal from '../Modal/LogoutModal';
import { StringUtils, AppUtils } from '../../utility';
import TitleBar from './TitleBar';

const isWindowsPlatform = AppUtils.isWindowsPlatform();
const titleBarHeight = isWindowsPlatform ? '32px' : '40px';

//NOTE default version update text.
const defaultNewVersionText = 'New version found. Please update the version'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needHardUpdate : false,
      newVersionModalVisible: false
    };
    this.onConfirmLogout = this.onConfirmLogout.bind(this);
    this.onCancelLogout = this.onCancelLogout.bind(this);
  }

  componentWillMount() {
    // Connect to blockchain
    this.props.connectToBlockchain();
  }

  componentDidUpdate(prevProps, prevState){

    //check if the version stored in props changed
    //we dun want to show the modal to notify the same version upon every route change
    if ( prevProps && this.props.version && this.props.version !== prevProps.version){

      const newVerNum = this.props.version.split('.');
      const currentVernNum = Config.version.split('.');
      const needHardUpdate = newVerNum[0] > currentVernNum[0]

      this.setState({ needHardUpdate });

      const needSoftUpdate = ( newVerNum[0] ===  currentVernNum[0] ) && ( newVerNum[1] > currentVernNum[1] )

      this.setState({
        newVersionModalVisible : (needHardUpdate || needSoftUpdate) &&
           (StringUtils.compareVersionNumbers(Config.version, this.props.version) < 0)
      });

    }

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
    console.log('click ok')
    // Logout
    this.props.confirmLogout(skipLogoutPopupNextTime);
  }

  onCancelLogout() {
    console.log('click cancel')
    // Hide modal
    this.props.showLogoutPopup(false);
  }

  render() {

    let softwareUpdateModal = (
        <SoftwareUpdateModal
          modalTitle={ this.props.displayText ? this.props.displayText.get(this.props.locale) : defaultNewVersionText }
          closable={ !this.state.needHardUpdate }
          visible={ this.state.newVersionModalVisible }
          onOk={ this.state.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
          onCancel={ this.state.needHardUpdate ? () => this.okWillCloseApp(false) : () => this.okWillCloseModal(false) }
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
      'min-height': titleBarHeight
    }

    return (
      <div className='app'>
        <TitleBar isWindowsPlatform={ isWindowsPlatform } style={ titleBarStyle } />
        <div className='app-content' style={ appContentStyle }>
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
  const displayText = softwareUpdate.get('displayText');
  const locale = i18n.get('locale');
  const isLoggedIn = app.get('isLoggedIn');
  const connectToBlockchainLoadingStatus = app.get('connectToBlockchainLoadingStatus');
  const isShowLogoutPopup = app.get('isShowLogoutPopup');

  return {
    connectToBlockchainLoadingStatus,
    isLoggedIn,
    version,
    displayText,
    locale,
    isShowLogoutPopup
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    connectToBlockchain: AppActions.connectToBlockchain,
    showLogoutPopup: AppActions.showLogoutPopupAction,
    confirmLogout: AccountActions.confirmLogout
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
