import React, { Component } from 'react';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';


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
    console.log('sync blockchain');
    this.setState({ loading: true });
    ChainStore.init().then(() => {
      this.setState({synced: true, loading: false, syncFail: false});
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

export default App;
