import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Menu,
  Icon
} from 'antd';
class DropdownMenu extends Component{
  //TODO: change href to actions
  render(){
    return(
      <Card className={ this.props.cardClass }>
        <Menu>
          <Menu.Item>
            <a href='/#/my-account'> <Icon type='user' /> { I18n.t('topbar.myaccount') } </a>
          </Menu.Item>
          <Menu.Item>
            <a href='/#/help'><Icon type='question-circle-o' /> { I18n.t('topbar.help') } </a>
          </Menu.Item>
          <Menu.Item>
            <a href='/#/logout'><Icon type='logout' /> { I18n.t('topbar.signout') } </a>
          </Menu.Item>
        </Menu>
      </Card>
    )
  }
}

export default DropdownMenu;
