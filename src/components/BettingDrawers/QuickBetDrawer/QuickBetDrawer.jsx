import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import EditableBetTable from '../EditableBetTable';
import { Button } from 'antd';
import Immutable from 'immutable';

const renderBlankDrawer = () => (
  <div className='blank-drawer'>
    <div className='instructions'>CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP</div>
    <div className='my-bet-button'>
      <Button>VIEW YOUR BETS IN MY BETS</Button>
    </div>
  </div>
)

const renderBetTables = (bets) => (
  <div>
    {
      // convert the list of keys into vanilla JS array for iterating
      bets.keySeq().toArray().map((eventId) => (
        <EditableBetTable
          key={ eventId }
          data={ bets.get(eventId) }
        />
      ))
    }
  </div>
)

const renderContent = (props) => {
  if (props.bets.isEmpty()) {
    return renderBlankDrawer();
  }

  return renderBetTables(props.bets);
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
  let page = Immutable.Map();
  bets.forEach((bet) => {
    const eventId = bet.get('event_id');
    const marketType = bet.get('market_type');
    // Page content are first grouped by event_id
    if (!page.has(eventId)) {
      /*
      let eventObj = Immutable.Map();
      eventObj = eventObj.set('id', eventId);
      eventObj = eventObj.set('name', bet.get('event_name'));
      eventObj = eventObj.set('unconfirmedBets', Immutable.Map());
      */
      const eventObj = Immutable.Map()
                          .set('id', eventId)
                          .set('name', bet.get('event_name'))
                          .set('unconfirmedBets', Immutable.Map());
      page = page.set(eventId, eventObj);
    }
    // Then page content is further grouped by market type (back or lay)
    let unconfirmedBets = page.getIn([eventId, 'unconfirmedBets']);
    if (!unconfirmedBets.has(marketType)) {
      unconfirmedBets = unconfirmedBets.set(marketType, Immutable.List());
    }
    // Add the bet to the list of bets with the same market type
    let betListByMarketType = unconfirmedBets.get(marketType);
    // TODO: Binned Order Book data are not in Immutable JS format yet
    let betObj = Immutable.Map()
                  .set('odds', bet.get('offer').odds)
                  .set('price', bet.get('offer').price)
                  .set('team', bet.get('team_name'));
    betListByMarketType = betListByMarketType.push(betObj);
    // Put everything back in their rightful places
    unconfirmedBets = unconfirmedBets.set(marketType, betListByMarketType);
    page = page.setIn([eventId, 'unconfirmedBets'], unconfirmedBets);
  });
  console.log('QuickBetDrawer Page', page.toJS());
  return {
    bets: page
  };
}

export default connect(mapStateToProps)(QuickBetDrawer);
