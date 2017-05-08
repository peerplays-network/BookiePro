import React, { Component } from 'react';
import { Layout } from 'antd';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { SidebarActions, AppActions } from '../../actions';
const { Content } = Layout;

class Main extends Component {

  componentDidMount() {
    // Get sidebar data
    this.props.getDataForSidebar();
    // Change title bar color to solid
    this.props.setTitleBarTransparency(false);
  }

  componentWillUnmount() {
    // Set title bar to transparent
    this.props.setTitleBarTransparency(true);
  }

  render() {
    return (
      <Layout className='layout'>
        <NavBar />
        <Layout>
          <Content className='main-content'>
            { this.props.children }
          </Content>
        </Layout>
      </Layout>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDataForSidebar : SidebarActions.getData,
    setTitleBarTransparency: AppActions.setTitleBarTransparency
  }, dispatch);
}

export default withRouter(connect(
  null,
  mapDispatchToProps
)(Main));
