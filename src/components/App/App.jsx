import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';
import { SoftwareUpdateActions } from '../../actions';
import { NavigateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'antd';
import { compareVersionNumbers } from '../../utility/Utils'

// NOTE ====================================  ALERT  ====================================
// NOTE { THIS CODE WILL BREAK WHEN RUNNING IN BROWSER / ENDPOINT IS LOCALHOST
// NOTE we could only get the version number from package.json in PACKED ELECTRON APP}
// NOTE
// NOTE uncomment it ONLY when we are about to publish packed electron app
// NOTE
// NOTE ref: https://github.com/electron/electron/issues/7085
// NOTE ref: https://electron.atom.io/docs/tutorial/quick-start/#write-your-first-electron-app
// NOTE ====================================  ALERT  ====================================
// const electron = window.require('electron');
// const { app } = electron.remote

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false, //  state of sync with blockchain
      syncFail: false,
      loading: false,

      newVersionModalVisible: false,

      //compatabile with format A.B and A.B.C   for comparision logic, pls check Utils.compareVersionNumbers
      currentVersion: "1.1.1" // hardcode for testing hardupdate/softupdate
    }
    this.syncWithBlockchain = this.syncWithBlockchain.bind(this);
  }

  componentDidMount() {

    // NOTE uncomment 'app.getVersion()' when we are about to publish packed electron app. for details, pls refer to the alert note on top.
    // this.setState({ currentVersion: app.getVersion() });

    this.syncWithBlockchain();
  }

  componentDidUpdate(prevProps, prevState){

    //when blockchain sync is done ( and success)
    if ( this.state.synced && prevState.synced === false){

      if ( this.props.version &&
        (this.props.needHardUpdate || this.props.needSoftUpdate) &&
        (compareVersionNumbers(this.state.currentVersion, this.props.version) < 0)){

        this.setState({
          newVersionModalVisible: true
        });

      } else {

        if ( this.props.location.pathname.length === 1){
          this.props.navigateTo('/login');
        }

        //TODO replace this block with below when we enforce 'login is required IN EVERY ROUTE'
        // if ( this.state.isLoggedIn){
        //   this.props.navigateTo('/exchange');
        // } else {
        //   this.props.navigateTo('/login');
        // }

      }
    }
  }

  syncWithBlockchain() {
    this.setState({ loading: true });
    ChainStore.init().then(() => {
      this.setState({
        synced: true,
        loading: false,
        syncFail: false});
      // Listen to software update
      this.props.listenToSoftwareUpdate();
    }).catch((error) => {
      console.error('ChainStore.init error', error);
      this.setState({
        loading: false,
        synced: false,
        syncFail: true});
    });
  }

  setModalVisible(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });
  }

  render() {

    let softwareUpdateModal = (
      <Modal
        title='I need to update first'
        wrapClassName='vertical-center-modal'
        closable={ !this.props.needHardUpdate }
        maskClosable={ !this.props.needHardUpdate }
        visible={ this.state.newVersionModalVisible }
        onOk={ () => this.setModalVisible(false) }
        onCancel={ () => this.setModalVisible(false) }
      >
        <p>I need to update first {this.props.version}</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    );

    let content = (
        <div className='sportsbg' id='main-content'>
          { softwareUpdateModal }
        </div>
    );

    if (this.state.syncFail) {
      content = (
        <div className='sportsbg' id='main-content'>
          <SyncError/>
        </div> );
    } else if (this.state.loading) {
      content = (
        <div className='sportsbg' id='main-content'>
          <span>loading...connecitng to blockchain</span>
        </div> );
    } else if (this.props.children){
      content = (
        <div id='main-content'>
          { this.props.children }
          { softwareUpdateModal }
        </div>
      );
    }

    return content;
  }
}

const mapStateToProps = (state) => {
  const { app, softwareUpdate } = state;
  return {
    isLoggedIn: app.isLoggedIn,
    needHardUpdate: softwareUpdate.needHardUpdate,
    needSoftUpdate: softwareUpdate.needSoftUpdate,
    version: softwareUpdate.version, //

    // uncomment below for testing
    // needHardUpdate: false,
    // needSoftUpdate: true,
    // version: "1.1.17", //
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    listenToSoftwareUpdate: SoftwareUpdateActions.listenToSoftwareUpdate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
