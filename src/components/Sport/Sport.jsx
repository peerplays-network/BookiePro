import React, { Component } from 'react';
import { connect } from 'react-redux';
import Banner from './Banner';
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
        <Banner sport={ this.props.sport }/>
        {
          Object.keys(this.props.eventGroups).map((eventGroupId) => {
            const eventGroup = this.props.eventGroups[eventGroupId];
            return (
              <SimpleBettingWidget
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

const mapStateToProps = (state, ownProps) => {
  const { sport, eventGroup, event } = state;

  const sportObject = sport.sports.find((obj) => obj.id === ownProps.params.objectId);
  let sportName = '';
  if (sportObject !== undefined) {
    sportName = sportObject.name;
  }

  let page = {};
  eventGroup.eventGroups.forEach((eventGroup) => {
    page[eventGroup.id] = { name: eventGroup.name };
  });
  event.events.forEach((event) => {
    let eventGroup = page[event.event_group_id];
    if (!eventGroup.hasOwnProperty('events')) {
      eventGroup['events'] = [];
    }
    eventGroup['events'].push({
      id: event.id,
      name: event.name,
      time: event.start_time,
      offers: findBinnedOrderBooksFromEvent(event, state)
    });
  });


  return {
    sport: sportName,
    eventGroups: page
  };
}

export default connect(mapStateToProps)(Sport);
