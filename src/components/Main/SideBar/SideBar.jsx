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

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onMouseOver() {
    this.setState({ collapsed: false });
  }

  onMouseOut() {
    this.setState({ collapsed: true });
  }

  render() {
    return (
      <Sider
        id='betex-sider'
        collapsible
        collapsed={ this.state.collapsed }
        trigger={ null }
        onMouseOver={ this.onMouseOver }
        onMouseOut={ this.onMouseOut }
        collapsedWidth={ 70 }    // TODO: can we read from css instead?
        width={ 250 }            // TODO: can we read from css instead?
      >
        <SideMenu />
        <FooterMenu />
      </Sider>
    );

  }
}

export default SideBar;
