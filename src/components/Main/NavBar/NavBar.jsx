/**
 * The Top bar is static and is visible in all screens after user has logined,
 * providing quick access to the commonly used functions including:
 *  - Search Terms
 *  - Go to my wager, my bets, my account and help & support
 *  - Display Account Balance
 *  - Show deposit dropdown
 *  - Display notifications.
 */
import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout} from 'antd';
//import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/images/bookie_logo_topnav.png';
import {AppUtils} from '../../../utility';
import {NavigateActions} from '../../../actions';
const {Header} = Layout;

class NavBar extends PureComponent {
  constructor(props) {
    super(props);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.onRouteChangeHandle = this.onRouteChangeHandle.bind(this);
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome() {
    this.props.navigateTo(AppUtils.getHomePath(this.props.bookMode));
  }

  //Called by parent component Main
  onRouteChangeHandle() {
    //this._searchMenu.onRouteChangeHandle();
  }

  renderLogo() {
    //Hide cursor and deactivate click event of logo when on home page
    const isHomeScreen = window.location.hash.endsWith('/exchange') ||
     window.location.hash.endsWith('/sportsbook');
    return (
      <div
        className={ 'logo' + (!isHomeScreen ? ' link' : '') }
        onClick={ !isHomeScreen ? this.handleNavigateToHome : null }
      >
        <img alt='logo' src={ logo } />
      </div>
    );
  }

  //pass all props from Main.jsx parent component to SearchMenu
  render() {
    return (
      <Header id='betex-header'>
        {this.renderLogo()}
        {/* <SearchMenu
          ref={ (ref) => this._searchMenu = ref }
          { ...this.props }
         /> */}
        <TopMenu />
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  bookMode: state.getIn(['app', 'bookMode'])
});


const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);

