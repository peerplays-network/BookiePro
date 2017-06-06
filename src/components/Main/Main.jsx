import React, { Component } from 'react';
import { Layout } from 'antd';
import NavBar from './NavBar';
import InitAccountModal from '../Modal/InitAccountModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { SidebarActions, AppActions } from '../../actions';
import { LoadingStatus } from '../../constants';
const { Content } = Layout;

class Main extends Component {

  constructor(props) {
    super(props);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  componentDidMount() {
    // Get sidebar data
    this.props.getDataForSidebar();
    // Change title bar color to solid
    this.props.setTitleBarTransparency(false);
    // this._navBar.navigateTo('/exchange')

    // this._navBar.onRouteChangeHandle();
    //http://andrewhfarmer.com/component-communication/
    // console.log( this._navBar)
  }

  componentWillUnmount() {
    // Set title bar to transparent
    this.props.setTitleBarTransparency(true);
  }

  onRouteChange(){
     console.log('onRouteChange')
    //  console.log(this.refs.navBarRef);
    // this._navBar.forceUpdate()
    console.log(this._navBar)
    // this._navBar.navigateTo('/exchange')


    //  this._navBar.onRouteChangeHandle();
  }

  render() {
    return (
      <Layout className='layout'>
        <NavBar ref={ (ref) => this._navBar = ref } sss='sss' onRouteChange={ this.onRouteChange }/>

        <Layout>
          <Content className='main-content'>
            {/* { this.props.children } */}
            {React.cloneElement(this.props.children, {
              onRouteChange: this.onRouteChange
            })}
          </Content>
        </Layout>
        <InitAccountModal visible={ this.props.isInitAccountModalVisible } />
      </Layout>
    )
  }


}

const mapStateToProps = (state) => {
  const initTransactionHistoryLoadingStatus = state.getIn(['rawHistory', 'initRawHistoryLoadingStatus']);
  const isInitAccountModalVisible = initTransactionHistoryLoadingStatus === LoadingStatus.LOADING;
  return {
    isInitAccountModalVisible
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDataForSidebar : SidebarActions.getData,
    setTitleBarTransparency: AppActions.setTitleBarTransparency
  }, dispatch);
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));
