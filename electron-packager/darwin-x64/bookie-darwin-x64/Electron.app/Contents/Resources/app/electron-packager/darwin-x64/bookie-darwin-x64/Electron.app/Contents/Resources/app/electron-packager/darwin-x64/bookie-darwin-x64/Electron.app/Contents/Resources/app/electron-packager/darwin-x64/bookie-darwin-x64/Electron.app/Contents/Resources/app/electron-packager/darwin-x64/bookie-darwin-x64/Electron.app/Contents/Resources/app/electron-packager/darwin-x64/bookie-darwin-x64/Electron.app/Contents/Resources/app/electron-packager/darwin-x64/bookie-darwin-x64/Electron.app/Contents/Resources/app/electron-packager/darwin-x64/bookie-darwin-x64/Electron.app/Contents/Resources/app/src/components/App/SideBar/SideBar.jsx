import React, { Component } from 'react';
import { Layout } from 'antd';
import SideMenu from './SideMenu';
import FooterMenu from './FooterMenu';

const { Sider } = Layout;

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };

    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
  }

  _onMouseOver() {
    this.setState({ collapsed: false });
  }

  _onMouseOut() {
    this.setState({ collapsed: true });
  }

  render() {
    return (
      <Sider
        id='betex-sider'
        collapsible
        collapsed={ this.state.collapsed }
        trigger={ null }
        onMouseOver={ this._onMouseOver }
        onMouseOut={ this._onMouseOut }
      >
        <SideMenu />
        <FooterMenu />
      </Sider>
    );

  }
}

export default SideBar;
