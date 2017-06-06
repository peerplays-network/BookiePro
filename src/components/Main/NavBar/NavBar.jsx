import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../../actions';
import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/images/bookie_logo_topnav.png';

const { Header } = Layout;

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome() {
    this.props.navigateTo('/exchange');
  }

  onRouteChangeHandle(){
    console.log ( ' nav bar onroute change');
  }
  blur = () => {
    console.log ( ' nav bar onroute change');
  }

  render(){
    return (
      <Header id='betex-header'>
        <div className='logo' onClick={ this.handleNavigateToHome }>
          <img alt='logo' src={ logo } />
        </div>
        <SearchMenu/>
        <TopMenu />
      </Header>
    )
  }

};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(NavBar);
