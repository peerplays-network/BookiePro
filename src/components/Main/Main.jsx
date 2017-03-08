import React, { Component } from 'react';
import { Layout } from 'antd';
import SideBar from './SideBar';
import NavBar from './NavBar';
import SyncError from '../SyncError';
import { ChainStore } from 'graphenejs-lib';

const { Content } = Layout;

class Main extends Component {
  render() {
    return (
      <Layout className='layout'>
        <NavBar />
        <Layout>
          <SideBar />
          <Content id='main-content'>
            { this.props.children }
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Main;
