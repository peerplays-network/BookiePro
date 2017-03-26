import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import MarketDrawer from './MarketDrawer';

const betslipWidth = 400;

class MarketDrawerContainer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.main));
    Ps.initialize(ReactDOM.findDOMNode(this.refs.drawer));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.main));
    Ps.update(ReactDOM.findDOMNode(this.refs.drawer));
  }

  render() {
    return (
      <SplitPane
          split='vertical'
          minSize={ betslipWidth } defaultSize={ betslipWidth }
          primary='second'>
            <div style={ { 'height' : '100%', 'position' : 'relative' } }
              ref='main'>
              { this.props.children }
            </div>
            <div style={ { 'height' : '100%', 'position' : 'relative' } }
              ref='drawer'>
              <MarketDrawer />
            </div>
      </SplitPane>
    );
  }
}

export default MarketDrawerContainer;
