import React, { Component } from 'react';
import { Badge, Menu, Icon } from 'antd';

class TopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 'smile',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <Menu
        className='top-menu'
        theme='dark'
        onClick={ this.handleClick }
        selectedKeys={ [this.state.current] }
        mode='horizontal'
      >
        <Menu.Item key='money' className='amount'>
          <Icon type='pay-circle-o' /> 1.133006
        </Menu.Item>
        <Menu.Item key='smile'>
          <Icon type='smile-o' />
        </Menu.Item>
        <Menu.Item key='frown'>
          <Icon type='frown-o' />
        </Menu.Item>
        <Menu.Item key='star' className='notification'>
          <Badge count={ 5 }>
            <Icon type='star-o' />
          </Badge>
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopMenu;
