import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
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
        data={ Immutable.fromJS({ unconfirmedBets: props.unconfirmedBets }) }
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

const mapStateToProps = (state) => {
  const unconfirmedBets = state.getIn(['marketDrawer', 'unconfirmedBets']);
  let betslips = Immutable.Map();
  unconfirmedBets.forEach((bet) => {
    const betType = bet.get('bet_type');

    // The betslips are grouped by market type (back or lay)
    if (!betslips.has(betType)) {
      betslips = betslips.set(betType, Immutable.List());
    }
    // Add the bet to the list of bets with the same market type
    let betListBybetType = betslips.get(betType);
    let betObj = Immutable.Map()
                  .set('odds', bet.getIn(['offer', 'odds']))
                  .set('price', bet.getIn(['offer', 'price']))
                  .set('team', bet.get('team_name'));
    betListBybetType = betListBybetType.push(betObj);
    // Put everything back in their rightful places
    betslips = betslips.set(betType, betListBybetType);
  });
  return {
    unconfirmedBets: betslips
  };
}


export default connect(mapStateToProps)(MarketDrawer);
