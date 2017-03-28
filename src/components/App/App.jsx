import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';
import { SoftwareUpdateActions } from '../../actions';
import { NavigateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SoftwareUpdateModal from '../Modal/SoftwareUpdateModal';
import { StringUtils } from '../../utility';

const defaultNewVersionText = 'New version found. Please update the version'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false, //  state of sync with blockchain
      syncFail: false,
      loading: false,

      newVersionModalVisible: false,
      currentVersion: "1.0.0"  // hardcode for testing hardupdate/softupdate

    }
    this.syncWithBlockchain = this.syncWithBlockchain.bind(this);
  }

  componentDidMount() {
    this.syncWithBlockchain();
  }

  componentDidUpdate(prevProps, prevState){

    //when blockchain sync is done ( and success), assuming connection success => sync success
    if ( (this.state.synced && prevState.synced === false) ||
      ( prevProps && this.props.version !== prevProps.version)){

      if ( this.props.version &&
        (this.props.needHardUpdate || this.props.needSoftUpdate) &&
        (StringUtils.compareVersionNumbers(this.state.currentVersion, this.props.version) < 0)){

        this.setState({
          newVersionModalVisible: true
        });

        if ( this.props.location.pathname.length === 1){
          this.props.navigateTo('/login');
        }
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

  setModalVisibleOK(modalVisible) {
    this.setState({
      newVersionModalVisible: modalVisible
    });

    if ( this.props.needHardUpdate){
      const remote = require('electron').remote;

      var window = remote.getCurrentWindow();
      window.close();
    }
  }

  render() {


    let softwareUpdateModal = (

        <SoftwareUpdateModal
          modalTitle={ this.props.displayText ? this.props.displayText.get(this.props.locale) : defaultNewVersionText }
          closable={ !this.props.needHardUpdate }
          visible={ this.state.newVersionModalVisible }
          onOk={ () => this.setModalVisibleOK(false) }
          onCancel={ () => this.setModalVisible(false) }
          latestVersion={ this.props.version }
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
          { softwareUpdateModal }

        </div> );
    } else if (this.state.loading) {
      content = (
        <div className='sportsbg'>
          <span>loading...connecitng to blockchain</span>
          { softwareUpdateModal }

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
  const app = state.get('app');
  const softwareUpdate = state.get('softwareUpdate');
  const i18n = state.get('i18n');
  return {

    isLoggedIn: app.get('isLoggedIn'),
    needHardUpdate: softwareUpdate.get('needHardUpdate'),
    needSoftUpdate: softwareUpdate.get('needSoftUpdate'),
    displayText: softwareUpdate.get('displayText'),
    version: softwareUpdate.get('version'), //
    locale: i18n.get('locale')

    // uncomment below for software update modal testing
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
