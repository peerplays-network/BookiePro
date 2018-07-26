import React from 'react';
import {I18n} from 'react-redux-i18n';
import {Card, Menu, Icon} from 'antd';

const DropdownMenu = (props) => {
  
  let isOnMyAccount = false;
  let isOnHelp = false;

  switch (window.location.hash) {
    case '#/my-account': 
      isOnMyAccount = true;
      break;
    case '#/help-and-support': 
      isOnHelp = true;
      break;
    default: 
      break;
  }
  
  return (
    <Card className={ props.cardClass }>
      <Menu onClick={ props.onSubmenuClick } selectedKeys={ [props.currentKey] }>
        <Menu.Item key='myaccount' className={ isOnMyAccount ? 'ant-menu-item-selected' : '' }>
          <Icon type='user' /> {I18n.t('topbar.myaccount')}
        </Menu.Item>
        <Menu.Item key='help' className={ isOnHelp  ? 'ant-menu-item-selected' : '' }>
          <Icon type='question-circle-o' /> {I18n.t('topbar.help')}
        </Menu.Item>
        <Menu.Item key='logout'>
          <Icon type='logout' /> {I18n.t('topbar.signout')}
        </Menu.Item>
      </Menu>
    </Card>
  );
};

export default DropdownMenu;
