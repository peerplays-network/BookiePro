import React from 'react';
import { Layout, Row, Col } from 'antd';

import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/logo.png';

const { Header } = Layout;

const NavBar = () => (
  <Header id='betex-header'>
    <Row>
      <Col span={ 15 }>
        <Row>
          <Col span={ 2 }>
            <div className='logo'>
              <img alt='logo' src={ logo } />
            </div>
          </Col>
          <Col span={ 22 }>
            <div className='search'>
              <SearchMenu />
            </div>
          </Col>
        </Row>


      </Col>
      <Col span={ 9 }>
        <div className='top-menu-wrapper'>
          <TopMenu />
        </div>
      </Col>
    </Row>


  </Header>
);

export default NavBar;
