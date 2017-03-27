import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllSportsBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { AllSportsActions } from '../../actions';
import Immutable from 'immutable';

const { getData } = AllSportsActions;

class AllSports extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData());
  }

  render() {
    return (
      <div id='all-sports-wrapper'>
        <AllSportsBanner />
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
  const bettingMarketGroupsById = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']).filter(
    (group) => event.get('betting_market_group_ids').includes(group.get('id'))
  );
  let bettingMarketIds = Immutable.List();
  bettingMarketGroupsById.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.get('betting_market_ids'));
  });

  const allSports = state.get('allSports');

  const binnedOrderBooks = allSports.get('binnedOrderBooks');
  let matchedBinnedOrderBooks = Immutable.List();
  bettingMarketIds.forEach((bettingMarketId) => {
    if (binnedOrderBooks.has(bettingMarketId)) {
      const orderBook = binnedOrderBooks.get(bettingMarketId);
      matchedBinnedOrderBooks = matchedBinnedOrderBooks.push({
        // TODO: this is a temporary solution where we change everything to normal JS object instead of immutable
        // TODO: later on mapStateToProps should return immutable object
        back: orderBook.get('aggregated_back_bets').toJS(),
        lay: orderBook.get('aggregated_lay_bets').toJS()
      });

    }
  });

  // TODO: this is a temporary solution where we change everything to normal JS object instead of immutable
  // TODO: later on mapStateToProps should return immutable object
  return matchedBinnedOrderBooks.toJS();
}

const mapStateToProps = (state) => {
  const sportsById = state.getIn(['sport', 'sportsById']);
  const eventsById = state.getIn(['event', 'eventsById']);

  // Construct the page content
  let page = {};

  // Create a map using sport id as keys
  sportsById.forEach((sport) => {
    const sportId = sport.get('id');
    page[sportId] = { name: sport.get('name') };
    page[sportId]['events'] = [];
  });

  // For each event, generate data entry for the Simple Betting Widget
  eventsById.forEach((event) => {
    const eventSportId = event.get('sport_id');
    if (page.hasOwnProperty(eventSportId)) {
      page[eventSportId]['events'].push({
        id: event.get('id'),
        name: event.get('name'),
        time: event.get('start_time'),
        offers: findBinnedOrderBooksFromEvent(event, state)
      });
    }
  });

  return {
    sports: page
  }
}

export default connect(mapStateToProps)(AllSports);
