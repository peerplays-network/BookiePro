import React, { Component } from 'react';
import { Layout } from 'antd';
import SideBar from './SideBar';
import NavBar from './NavBar';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synced: false,
      syncFail: false,
      loading: false
    }
    this._syncWithBlockchain = this._syncWithBlockchain.bind(this);
  }

  componentDidMount() {
    this._syncWithBlockchain();
  }

  _syncWithBlockchain() {
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
    } else if (this.props.location.pathname === '/init-error') {
      // If init error, no need to show header and sider
      content = this.props.children;
    } else {
      content = (
          <Layout className='layout'>
            <NavBar />
            <Layout>
              <SideBar />
              <Content id='main-content'>
                { this.props.children }
              </Content>
            </Layout>
          </Layout>
      );
    }

    return content;
  }
}

export default App;
