import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Ps from 'perfect-scrollbar';
import SplitPane from 'react-split-pane';
import { Button } from 'antd';
import EditableBetTable from '../EditableBetTable';

const renderContent = (props) => (
  <div className='content' ref='bettingtable'>
    { props.bets.isEmpty() &&
      <div className='blank'>
        <div className='instructions'>CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP</div>
        <div className='my-bet-button'>
          <Button>VIEW YOUR BETS IN MY BETS</Button>
        </div>
      </div>
    }
    { !props.bets.isEmpty() &&
      // convert the list of keys into vanilla JS array for iterating
      props.bets.keySeq().toArray().map((eventId) => (
        <EditableBetTable
          key={ eventId }
          data={ props.bets.get(eventId) }
        />
      ))
    }
  </div>
)

class QuickBetDrawer extends Component {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.bettingtable));
  }

  render() {
    console.log(this.props.bets.toJS());
    return (
      <div id='quick-bet-drawer' ref='drawer'>
        <SplitPane split='horizontal' defaultSize='40px'>
          <div className='title'>
            <div className='label'>BETSLIP</div>
          </div>
          <SplitPane
            split='horizontal'
            minSize={ 40 }
            defaultSize={ 40 }
            primary='second'
            pane1Style={ { 'overflowY': 'hidden' } }
          >
            { renderContent(this.props) }
            {
              !this.props.bets.isEmpty() &&
              <div className='footer'>
                <Button className='place-bet'>PLACE BET $0.295</Button>
              </div>
            }
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const bets = state.getIn(['quickBetDrawer', 'bets']);
  let page = Immutable.Map();
  bets.forEach((bet) => {
    const eventId = bet.get('event_id');
    const marketType = bet.get('market_type');
    // Page content are first grouped by event_id
    if (!page.has(eventId)) {
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
    let betObj = Immutable.Map()
                  .set('odds', bet.getIn(['offer', 'odds']))
                  .set('price', bet.getIn(['offer', 'price']))
                  .set('team', bet.get('team_name'));
    betListByMarketType = betListByMarketType.push(betObj);
    // Put everything back in their rightful places
    unconfirmedBets = unconfirmedBets.set(marketType, betListByMarketType);
    page = page.setIn([eventId, 'unconfirmedBets'], unconfirmedBets);
  });
  return {
    bets: page
  };
}

export default connect(mapStateToProps)(QuickBetDrawer);
