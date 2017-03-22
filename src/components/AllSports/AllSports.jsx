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
        {
          Object.keys(this.props.sports).map((sportId, idx) => {
            const sport = this.props.sports[sportId];
            return (
              <SimpleBettingWidget
                key={ idx }
                title={ sport.name }
                events={ sport.events }
              />
            )
          })
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

  // Construct the page content
  let page = {};

  // Create a map using sport id as keys
  sport.sports.forEach((sport) => {
    page[sport.id] = { name: sport.name };
    page[sport.id]['events'] = [];
  });

  // For each event, generate data entry for the Simple Betting Widget
  event.events.forEach((event) => {
    if (page.hasOwnProperty(event.sport_id)) {
      page[event.sport_id]['events'].push({
        id: event.id,
        name: event.name,
        time: event.start_time,
        offers: findBinnedOrderBooksFromEvent(event, state)
      });
    }
  });

  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
