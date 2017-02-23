import React from 'react';
import { Layout } from 'antd';

import SearchMenu from './SearchMenu';
import TopMenu from './TopMenu';
import logo from '../../../assets/logo.png';

const { Header } = Layout;

const NavBar = () => (
  <Header id='betex-header'>
    <div className='float-left'>
      <div className='logo'>
        <img alt='logo' src={ logo } />
      </div>
      <div className='search'>
        <SearchMenu />
      </div>
    </div>
    <div className='float-right'>
      <TopMenu />
    </div>
    <div className='clearfix' />
  </Header>
);

export default NavBar;
