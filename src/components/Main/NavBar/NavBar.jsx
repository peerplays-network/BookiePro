import React from 'react';
import { Layout } from 'antd';
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
    this._searchMenu.onRouteChangeHandle();
  }

  render(){
    return (
      <Header id='betex-header'>
        <div className='logo' onClick={ this.props.handleNavigateToHome }>
          <img alt='logo' src={ logo } />
        </div>
        <SearchMenu
          ref={ (ref) => this._searchMenu = ref }
          { ...this.props }
         />
        <TopMenu />
      </Header>
    )
  }

};

export default NavBar;
