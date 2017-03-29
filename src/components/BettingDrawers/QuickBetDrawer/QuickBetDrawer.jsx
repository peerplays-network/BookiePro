import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import EditableBetTable from '../EditableBetTable';
import { Button } from 'antd';

const renderBlankDrawer = () => (
  <div className='blank-drawer'>
    <div className='instructions'>CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP</div>
    <div className='my-bet-button'>
      <Button>VIEW YOUR BETS IN MY BETS</Button>
    </div>
  </div>
)

const renderBetTables = (props) => (
  <div>
    <EditableBetTable />
    <EditableBetTable />
    <EditableBetTable />
  </div>
)

const renderContent = (props) => {
  if (props.bets.isEmpty()) {
    return renderBlankDrawer();
  }

  return renderBetTables(props);
}

class QuickBetDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.drawer));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.drawer));
  }

  render() {
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <div className='title'>
          <div className='label'>BETSLIP</div>
        </div>
        <div className='content'>
          { renderContent(this.props) }
        </div>
        {
          !this.props.bets.isEmpty() &&
          <div className='footer'>
            <Button className='place-bet'>PLACE BET $0.295</Button>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const bets = state.getIn(['quickBetDrawer', 'bets']);
  console.log('QuickBetDrawer mapState', bets.toJS());
  return {
    bets: bets
  };
}

export default connect(mapStateToProps)(QuickBetDrawer);
