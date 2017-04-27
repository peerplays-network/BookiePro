import React, { Component } from 'react';
import { Layout } from 'antd';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { SidebarActions } from '../../actions';
const { Content } = Layout;

class Main extends Component {

  componentDidMount() {
    const { getDataForSidebar } = this.props
    getDataForSidebar();
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
  }, dispatch);
}

export default withRouter(connect(
  null,
  mapDispatchToProps
)(Main));
