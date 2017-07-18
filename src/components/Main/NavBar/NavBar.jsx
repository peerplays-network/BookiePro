import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/images/bookie_logo_topnav.png';

const { Header } = Layout;

class NavBar extends PureComponent {

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

  renderLogo(){
    //Hide cursor and deactivate click event of logo when on home page
    const isHomeScreen = window.location.hash.includes('/exchange');
    return(
      <div
        className={ 'logo' + (!isHomeScreen ? ' link' : '') }
        onClick={ !isHomeScreen ? this.handleNavigateToHome : null }>
        <img alt='logo' src={ logo } />
      </div>
    )
  }

  render(){
    return (
      <Header id='betex-header'>
        { this.renderLogo() }
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
