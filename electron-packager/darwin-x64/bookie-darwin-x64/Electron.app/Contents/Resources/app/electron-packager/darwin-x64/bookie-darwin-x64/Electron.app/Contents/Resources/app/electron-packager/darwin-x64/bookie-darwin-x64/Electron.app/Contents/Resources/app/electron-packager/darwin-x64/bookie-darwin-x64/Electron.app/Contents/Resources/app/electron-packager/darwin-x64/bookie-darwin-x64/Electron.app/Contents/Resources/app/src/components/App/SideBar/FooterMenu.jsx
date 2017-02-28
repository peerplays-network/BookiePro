import React, { Component } from 'react';
import { Icon, Menu } from 'antd';

class FooterMenu extends Component {
  render() {
    return (
      <Menu
        theme='dark'
        className='footer-menu'
        mode='vertical'
      >
        <Menu.Item className='connectivity'>
          <Icon type='smile-o' />
          <span className='submenu-title nav-text'>CONNECTED</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className='clock'>
          <span>13:15</span>
        </Menu.Item>
      </Menu>
    );
  }
}

export default FooterMenu;
