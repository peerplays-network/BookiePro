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
    if ( this.state.synced && prevState.synced === false){

      // if ( this.state)
      // this.props.navigateTo('/login');
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
      content = <SyncError />
    } else if (this.state.loading) {
      // If it is loading, no need to show header and sider
      content = (   <div className='sportsbg' id='main-content'>
          <span>loading...</span>
        </div> );
    } else if ( this.props.children ) {
      content = ( this.props.children );
    }

    console.log('content : ', content);
    return content;
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    listenToSoftwareUpdate: SoftwareUpdateActions.listenToSoftwareUpdate
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
