import React, { Component } from 'react';
import { connect } from 'react-redux';
import Banner from './Banner';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { AllSportsActions } from '../../actions';

const { getData } = AllSportsActions;

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
          <SimpleBettingWidget
            title={ this.props.sports['1.100.1'].name }
            events={ this.props.sports['1.100.1'].events }
          />
        }
      </div>
    );
  }
}

// TODO: Should be a common function
const findBinnedOrderBooksFromEvent = (event, state) => {
  const bettingMarketGroups = state.bettingMarketGroup.bettingMarketGroups.filter(
    (group) => event.betting_market_group_ids.includes(group.id)
  );
  let bettingMarketIds = [];
  bettingMarketGroups.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.betting_market_ids);
  });

  const { allSports } = state;

  const binnedOrderBooks = allSports.binnedOrderBooks;
  const matchedBinnedOrderBooks = [];
  bettingMarketIds.forEach((bettingMarketId) => {
    if (binnedOrderBooks.hasOwnProperty(bettingMarketId)) {
      const orderBook = allSports.binnedOrderBooks[bettingMarketId];
      matchedBinnedOrderBooks.push({
        back: orderBook.aggregated_back_bets,
        lay: orderBook.aggregated_lay_bets
      });
    }
  });

  return matchedBinnedOrderBooks;
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
