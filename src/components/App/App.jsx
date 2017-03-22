// NOTE uncomment it when running in electron with "npm run pack"
// NOTE we could only get the version number from package.json in app from packed
// NOTE ref: https://github.com/electron/electron/issues/7085
// const electron = window.require('electron');
// const { app } = electron.remote


import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';
import { SoftwareUpdateActions } from '../../actions';
import { NavigateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false,
      syncFail: false,
      loading: false,
      testingUpdate: true
    }
    this.syncWithBlockchain = this.syncWithBlockchain.bind(this);
  }

  componentDidMount() {
    this.syncWithBlockchain();
  }
  componentDidUpdate(prevProps, prevState){

    //
    if ( this.state.synced && prevState.synced === false){

      try {
        if (typeof app === 'undefined' ){

        } else {
          // let appVersion = app.getVersion();
          // console.log( appVersion);
        };
      } catch(err) {
          // caught the reference error
          // code here will execute **only** if variable was never declared
      }

      //TODO uncomment when we enforce 'loginined is required'
      if ( this.state.isLoggedIn){
        this.props.navigateTo('/exchange');
      } else {
        this.props.navigateTo('/login');
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

  render() {
    let content = (
        <div className='sportsbg' id='main-content'>
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
    } else if ( this.props.children ) {
      content = ( this.props.children );
    }

    return content;
  }
}

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    isLoggedIn: app.isLoggedIn,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    listenToSoftwareUpdate: SoftwareUpdateActions.listenToSoftwareUpdate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
