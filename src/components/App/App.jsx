import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';
import { SoftwareUpdateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false,
      syncFail: false,
      loading: false
    }
    this.syncWithBlockchain = this.syncWithBlockchain.bind(this);
  }

  componentDidMount() {
    this.syncWithBlockchain();
  }

  syncWithBlockchain() {
    this.setState({ loading: true });
    ChainStore.init().then(() => {
      this.setState({synced: true, loading: false, syncFail: false});
      // Listen to software update
      this.props.listenToSoftwareUpdate();
    }).catch((error) => {
      console.error('ChainStore.init error', error);
      this.setState({loading: false, synced: false, syncFail: true});
    });
  }

  render() {
    let content = null;

    if (this.state.syncFail) {
      content = <SyncError />
    } else if (this.props.connectingToBlockchain) {
      // If it is loading, no need to show header and sider
      content = ( <span>loading...</span> );
    } else  {
      content = this.props.children;
    }

    return content;
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    listenToSoftwareUpdate: SoftwareUpdateActions.listenToSoftwareUpdate
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
