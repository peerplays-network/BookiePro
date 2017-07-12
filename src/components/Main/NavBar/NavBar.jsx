import React from 'react';
import { Layout } from 'antd';
import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/images/bookie_logo_topnav.png';

const { Header } = Layout;

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isHomeScreen : false
    }
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isHomeScreen:
      nextProps.location.pathname.indexOf('/exchange') !== -1 ? true : false });
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
    return(
      <div
        className={ 'logo' + (!this.state.isHomeScreen ? ' link' : '') }
        onClick={ !this.state.isHomeScreen ? this.handleNavigateToHome : null }>
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
