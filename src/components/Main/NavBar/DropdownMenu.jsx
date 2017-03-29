import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Menu,
  Icon
} from 'antd';
class DropdownMenu extends Component{
  render(){
    return(
      <Card className={ this.props.cardClass }>
        <Menu>
          <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.alipay.com/'> <Icon type='user' /> { I18n.t('topbar.myaccount') } </a>
          </Menu.Item>
          <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.taobao.com/'><Icon type='user' /> { I18n.t('topbar.help') } </a>
          </Menu.Item>
          <Menu.Item>
            <a target='_blank' rel='noopener noreferrer' href='http://www.tmall.com/'><Icon type='user' /> { I18n.t('topbar.signout') } </a>
          </Menu.Item>
        </Menu>
      </Card>
    )
  }
}

export default DropdownMenu;