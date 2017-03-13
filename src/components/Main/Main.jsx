import React, { Component } from 'react';
import { Layout } from 'antd';
import SideBar from './SideBar';
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


    //backup for big change ( side bar is no longer a shared component in all the props.children)
    // return (
    //   <Layout className='layout'>
    //     <NavBar />
    //     <Layout>
    //       <SideBar />
    //       <Content id='main-content'>
    //         { this.props.children }
    //       </Content>
    //     </Layout>
    //   </Layout>
    // )
  }
}

export default Main;
