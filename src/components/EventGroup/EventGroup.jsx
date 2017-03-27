import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { EventGroupPageActions } from '../../actions';
import Immutable from 'immutable';

const { getData } = EventGroupPageActions;

class EventGroup extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    return (
      <div className='event-group-wrapper'>
        <SportBanner sport={ this.props.sport }/>
        <SimpleBettingWidget
          title={ this.props.eventGroup }
          events={ this.props.events }
        />
      </div>
    )
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
  const eventsById = state.getIn(['event', 'eventsById']);
  const eventGroupPage = state.get('eventGroupPage');

  // For each event, generate data entry for the Simple Betting Widget
  const myEvents = eventsById.toArray()
    .filter((event) => eventGroupPage.get('eventIds').includes(event.get('id')))
    .map((event) => {
      return {
        id: event.get('id'),
        name: event.get('name'),
        time: event.get('start_time'),
        offers: findBinnedOrderBooksFromEvent(event, state)
      }
    });

    // TODO: this is a temporary solution where we change everything to normal JS object instead of immutable
    // TODO: later on mapStateToProps should return immutable object
    console.log('myevents', myEvents);

  return {
    sport: eventGroupPage.get('sportName'),
    eventGroup: eventGroupPage.get('eventGroupName'),

    events: myEvents
  };
};

export default connect(mapStateToProps)(EventGroup);
