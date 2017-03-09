import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

class SideMenu extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
};
  constructor(props) {
    super(props);

    this.state = {
      current: '0',
    };

    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(e) {
    console.log('click ', e);
    const current = e.key;
    this.setState({ current });
    switch (current) {
      case 'blockchain_test_page': {
        this.context.router.push('/blockchain-test-page');
        break;
      }
      case 'home': {
        this.context.router.push('/home');
        break;
      }
      case 'my_account': {
        this.context.router.push('/my-account');
        break;
      }
      case 'my_wager': {
        this.context.router.push('/my-wager');
        break;
      }
      default: {
        this.context.router.push('/empty-page');
        break;
      }

    }

  }

  _renderMenuTitle(icon, title) {
    return (
      <span>
        <Icon type={ icon } />
        <span className='submenu-title nav-text'>{ title }</span>
      </span>
    );
  }

  render() {
    return (
      <Menu
        className='side-menu'
        theme='dark'
        onClick={ this._handleClick }
        defaultOpenKeys={ ['american_football'] }
        selectedKeys={ [this.state.current] }
        mode='vertical'
      >
        <Menu.Item key='home'>
          { this._renderMenuTitle('home', 'HOME') }
        </Menu.Item>
        <Menu.Item key='american_football'>
          { this._renderMenuTitle('like-o', 'AMERICAN FOOTBALL') }
        </Menu.Item>
        <Menu.Item key='hockey'>
          { this._renderMenuTitle('check', 'HOCKEY') }
        </Menu.Item>
        <Menu.Item key='baseball'>
          { this._renderMenuTitle('rocket', 'BASEBALL') }
        </Menu.Item>
        <Menu.Item key='basketball'>
          { this._renderMenuTitle('pause-circle-o', 'BASKETBALL') }
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='my_account'>
          { this._renderMenuTitle('user', 'MY ACCOUNT') }
        </Menu.Item>
        <Menu.Item key='my_wager'>
          { this._renderMenuTitle('calendar', 'MY WAGER') }
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='question'>
          { this._renderMenuTitle('question-circle-o', 'HELP & SUPPORT') }
        </Menu.Item>
        <Menu.Item key='logout'>
          { this._renderMenuTitle('logout', 'SIGN OUT') }
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='blockchain_test_page'>
          { this._renderMenuTitle('eye', 'BLOCKCHAIN TEST PAGE') }
        </Menu.Item>
      </Menu>
    );
  }
}

export default SideMenu;
