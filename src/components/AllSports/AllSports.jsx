import React, { Component } from 'react';
import { connect } from 'react-redux';
import BetSlip from '../BetSlip';
import Banner from './Banner';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { HomeActions } from '../../actions';

const { getData } = HomeActions;

class AllSports extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData());
  }

  render() {
    return (
      <div id='all-sports-wrapper'>
        <Banner />
        { Object.keys(this.props.sports).length > 0 &&
          <SimpleBettingWidget sport={ this.props.sports['1.100.1'] } />
        }
      </div>
    );
  }
}

const findBinnedOrderBooksFromEvent = (event, state) => {
  const bettingMarketGroups = state.bettingMarketGroup.bettingMarketGroups.filter(
    (group) => event.betting_market_group_ids.includes(group.id)
  );
  let bettingMarketIds = [];
  bettingMarketGroups.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.betting_market_ids);
  });

  return state.binnedOrderBook.binnedOrderBooks.filter((orderBook) => {
    return bettingMarketIds.includes(orderBook.betting_market_id)
  }).map((orderBook) => {
    return {
      back: orderBook.aggregated_back_bets,
      lay: orderBook.aggregated_lay_bets
    }
  });
}

const mapStateToProps = (state) => {
  const { sport, event } = state;
  let page = {};
  sport.sports.forEach((sport) => {
    page[sport.id] = { name: sport.name };
  });
  event.events.forEach((event) => {
    let sport = page[event.sport_id];
    if (!sport.hasOwnProperty('events')) {
      sport['events'] = [];
    }
    sport['events'].push({
      id: event.id,
      name: event.name,
      time: event.start_time,
      offers: findBinnedOrderBooksFromEvent(event, state)
    });
  });

  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
