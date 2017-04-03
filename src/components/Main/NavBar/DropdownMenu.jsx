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
        <Menu.Item key='myaccount'>
          <Icon type='user' /> { I18n.t('topbar.myaccount') }
        </Menu.Item>
        <Menu.Item key='help'>
          <Icon type='question-circle-o' /> { I18n.t('topbar.help') }
        </Menu.Item>
        <Menu.Item key='logout'>
          <Icon type='logout' /> { I18n.t('topbar.signout') }
        </Menu.Item>
      </Menu>
    </Card>
  )
}

export default DropdownMenu;
