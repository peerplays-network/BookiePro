import React, { Component } from 'react';
import { Layout } from 'antd';
import NavBar from './NavBar';
import InitAccountModal from '../Modal/InitAccountModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { NavigateActions, SidebarActions, AppActions, EventActions } from '../../actions';
import { LoadingStatus } from '../../constants';
const { Content } = Layout;

class Main extends Component {

  constructor(props) {
    super(props);
    this.onRouteChange = this.onRouteChange.bind(this);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);

  }

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

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome() {
    this.props.navigateTo('/exchange');
  }

  onRouteChange(){
     this._navBar.onRouteChangeHandle();
  }

  render() {
    return (
      <Layout className='layout'>
        <NavBar
          ref={ (ref) => this._navBar = ref }
          { ...this.props }
        />
        <Layout>
          <Content className='main-content'>
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

  const sidebar = state.get('sidebar');
  const event = state.get('event');

  return {
    isInitAccountModalVisible,
    completeTree: sidebar.get('complete_tree'),
    searchResult: event.get('searchResult'),
    getSearchEventsLoadingStatus: event.get('getSearchEventsLoadingStatus'),
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getDataForSidebar : SidebarActions.getData,
    setTitleBarTransparency: AppActions.setTitleBarTransparency,
    searchEvents: EventActions.searchEvents,
    clearSearchResult: EventActions.clearSearchResult
  }, dispatch);
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));
