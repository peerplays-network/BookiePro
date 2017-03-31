import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import EditableBetTable from '../EditableBetTable';

const renderContent = (props) => (
  <div className='content' ref='unconfirmedBets'>
    { props.unconfirmedBets.isEmpty() &&
      <div className='blank'>
        <div className='instructions'>CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP</div>
      </div>
    }
    { !props.unconfirmedBets.isEmpty() &&
      <EditableBetTable
        data={ props.unconfirmedBets }
      />
    }
  </div>
)

class MarketDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.unconfirmedBets));
  }

  render() {
    console.log(this.props);
    return (
      <div id='market-drawer'>
        <div className='title'>
          <div className='label'>BetSlip</div>
        </div>
        { renderContent(this.props) }
      </div>
    );
  }
}

const mapStatToProps = (state) => {
  const unconfirmedBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  return {
    unconfirmedBets: unconfirmedBets
  };
}


export default connect(mapStatToProps)(MarketDrawer);
