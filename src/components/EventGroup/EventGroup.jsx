import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { EventGroupPageActions } from '../../actions';

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
  const bettingMarketGroups = state.bettingMarketGroup.bettingMarketGroups.filter(
    (group) => event.betting_market_group_ids.includes(group.id)
  );
  let bettingMarketIds = [];
  bettingMarketGroups.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.betting_market_ids);
  });

  const { eventGroupPage } = state;

  const binnedOrderBooks = eventGroupPage.binnedOrderBooks;
  const matchedBinnedOrderBooks = [];
  bettingMarketIds.forEach((bettingMarketId) => {
    if (binnedOrderBooks.hasOwnProperty(bettingMarketId)) {
      const orderBook = eventGroupPage.binnedOrderBooks[bettingMarketId];
      matchedBinnedOrderBooks.push({
        back: orderBook.aggregated_back_bets,
        lay: orderBook.aggregated_lay_bets
      });
    }
  });

  return matchedBinnedOrderBooks;
}

const mapStateToProps = (state) => {
  const { event, eventGroupPage } = state;

  // For each event, generate data entry for the Simple Betting Widget
  const myEvents = event.events
    .filter((event) => eventGroupPage.eventIds.includes(event.id))
    .map((event) => {
      return {
        id: event.id,
        name: event.name,
        time: event.start_time,
        offers: findBinnedOrderBooksFromEvent(event, state)
      }
    });

  return {
    sport: eventGroupPage.sportName,
    eventGroup: eventGroupPage.eventGroupName,
    events: myEvents
  };
};

export default connect(mapStateToProps)(EventGroup);
