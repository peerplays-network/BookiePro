import React from 'react';
import { Layout, Row, Col } from 'antd';

import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/logo.png';

const { Header } = Layout;

const NavBar = () => (
  <Header id='betex-header'>
    <Row className='top-bar-row' type='flex'>
      <Col>
        <div className='logo'>
          <img alt='logo' src={ logo } />
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
);

export default NavBar;
