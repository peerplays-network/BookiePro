import React from 'react';
import { I18n } from 'react-redux-i18n';
import {
  Card,
  Menu,
  Icon
} from 'antd';

const DropdownMenu = (props) => {
  return(
    <Card className={ props.cardClass }>
      <Menu onClick={ props.onSubmenuClick }>
        <Menu.Item key='myaccount' className={ window.location.hash === '#/my-account' ? '' : 'ant-menu-item-default' }>
          <i className='account-dropdown-icon'></i> { I18n.t('topbar.myaccount') }
        </Menu.Item>
        <Menu.Item key='help' className={ window.location.hash === '#/help-and-support' ? '' : 'ant-menu-item-default' }>
          <Icon type='question-circle-o' /> { I18n.t('topbar.help') }
        </Menu.Item>
        <Menu.Item key='logout' className='ant-menu-item-default'>
          <Icon type='logout' /> { I18n.t('topbar.signout') }
        </Menu.Item>
      </Menu>
    </Card>
  )
}

export default DropdownMenu;
