import React from 'react';
import { Icon, Input, Menu } from 'antd';

const SearchMenu = () => (
  <Menu
    className='search-menu'
    theme='dark'
  >
    <Menu.Item>
      <Input
        prefix={ <Icon type='search' /> }
        placeholder='Search Team'
      />
    </Menu.Item>
  </Menu>
);

export default SearchMenu;
