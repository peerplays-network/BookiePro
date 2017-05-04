import React from 'react';
import { Layout, Row, Col } from 'antd';
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
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome() {
    this.props.navigateTo('/exchange');
  }

  render(){
    return (
      <Header id='betex-header'>
        <Row className='top-bar-row' type='flex'>
          <Col>
            <div className='logo'>
              <img alt='logo' src={ logo } onClick={ this.handleNavigateToHome }/>
            </div>
          </Col>
          <Col>
            <div className='search'>
              <SearchMenu />
            </div>
          </Col>
          <Col>
            <div className='top-menu-wrapper'>
              <TopMenu />
            </div>
          </Col>
        </Row>
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
