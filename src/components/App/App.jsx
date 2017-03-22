import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';
import { SoftwareUpdateActions } from '../../actions';
import { NavigateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import { compareVersionNumbers } from '../../utility/versionUtils'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false, //  state of sync with blockchain
      syncFail: false,
      loading: false,

      newVersionModalVisible: false,

      currentVersion: "1.1.1" // hardcode for testing hardupdate/softupdate
    }
    this.syncWithBlockchain = this.syncWithBlockchain.bind(this);
  }

  componentDidMount() {
    this.syncWithBlockchain();
  }

  componentDidUpdate(prevProps, prevState){

    //when blockchain sync is done ( and success), assuming connection success => sync success
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
    } else if ( this.state.synced &&
      prevState.synced === true &&
      this.props.location.pathname.length === 1){

      this.props.navigateTo('/login');
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
      <SoftwareUpdateModal
        title='I need to update the app first'
        closable={ !this.props.needHardUpdate }
        visible={ this.state.newVersionModalVisible }
        onOk={ () => this.setModalVisible(false) }
        onCancel={ () => this.setModalVisible(false) }
      />
    );

    let content = (
        <div className='sportsbg'>
          { softwareUpdateModal }
        </div>
    );

    if (this.state.syncFail) {
      content = (
        <div className='sportsbg'>
          <SyncError/>
        </div> );
    } else if (this.state.loading) {
      content = (
        <div className='sportsbg'>
          <span>loading...connecitng to blockchain</span>
        </div> );
    } else if (this.props.children){
      content = (
        <div>
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
    // needHardUpdate: true,
    // needSoftUpdate: false,
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
