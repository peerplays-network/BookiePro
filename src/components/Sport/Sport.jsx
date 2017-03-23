import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { SportPageActions } from '../../actions';

const { getData } = SportPageActions;

class Sport extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    return (
      <div className='sport-wrapper'>
        <SportBanner sport={ this.props.sport }/>
        {
          Object.keys(this.props.eventGroups).map((eventGroupId, idx) => {
            const eventGroup = this.props.eventGroups[eventGroupId];
            return (
              <SimpleBettingWidget
                key={ idx }
                title={ eventGroup.name }
                events={ eventGroup.events }
              />
            );
          })
        }
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

  const { sportPage } = state;

  const binnedOrderBooks = sportPage.binnedOrderBooks;
  const matchedBinnedOrderBooks = [];
  bettingMarketIds.forEach((bettingMarketId) => {
    if (binnedOrderBooks.hasOwnProperty(bettingMarketId)) {
      const orderBook = sportPage.binnedOrderBooks[bettingMarketId];
      matchedBinnedOrderBooks.push({
        back: orderBook.aggregated_back_bets,
        lay: orderBook.aggregated_lay_bets
      });
    }
  });

  return matchedBinnedOrderBooks;
}

const mapStateToProps = (state, ownProps) => {
  const { sport, eventGroup, event, sportPage } = state;

  // Determine the banner title
  const sportObject = sport.sports.find((obj) => obj.id === ownProps.params.objectId);
  let sportName = '';
  if (sportObject !== undefined) {
    sportName = sportObject.name;
  }

  // Construct the page content
  let page = {};

  // First, found all relevant event objects based on the component's state
  const myEvents = event.events.filter((event) => sportPage.eventIds.includes(event.id));

  // Create a map using event group id as keys
  eventGroup.eventGroups.forEach((eventGroup) => {
    if (sportPage.eventGroupIds.includes(eventGroup.id)) {
      page[eventGroup.id] = { name: eventGroup.name };
      page[eventGroup.id]['events'] = [];
    }
  });

  // For each event, generate data entry for the Simple Betting Widget
  myEvents.forEach((event) => {
    if (page.hasOwnProperty(event.event_group_id)) {
      page[event.event_group_id]['events'].push({
        id: event.id,
        name: event.name,
        time: event.start_time,
        offers: findBinnedOrderBooksFromEvent(event, state)
      });
    }
  });

  return {
    sport: sportName,
    eventGroups: page
  };
}

export default connect(mapStateToProps)(Sport);
