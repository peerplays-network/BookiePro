import React, { Component } from 'react';
import { Layout } from 'antd';
import NavBar from './NavBar';

const { Content } = Layout;

class Main extends Component {
  render() {
    return (
      <Layout className='layout'>
        <NavBar />
        <Layout>
          <Content id='main-content'>
            { this.props.children }
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Main;
