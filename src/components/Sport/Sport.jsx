import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import SimpleBettingWidget from '../SimpleBettingWidget';
import { SportPageActions } from '../../actions';
import Immutable from 'immutable';
const { getData } = SportPageActions;

class Sport extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    console.log('render this.props', this.props);
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
  const bettingMarketGroupsById = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']).filter(
    (group) => event.get('betting_market_group_ids').includes(group.get('id'))
  );
  let bettingMarketIds = Immutable.List();
  bettingMarketGroupsById.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.get('betting_market_ids'));
  });

  const sportPage = state.get('sportPage');

  const binnedOrderBooks = sportPage.get('binnedOrderBooks');
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

const mapStateToProps = (state, ownProps) => {
  const sportsById = state.getIn(['sport', 'sportsById']);
  const eventsById = state.getIn(['event', 'eventsById']);
  const sportPage = state.get('sportPage');
  const eventGroupsById = state.getIn(['eventGroup', 'eventGroupsById']);

  // Determine the banner title
  const sportObject = sportsById.get(ownProps.params.objectId);
  let sportName = '';
  if (sportObject !== undefined) {
    sportName = sportObject.get('name');
  }

  // Construct the page content
  let page = {};

  // First, found all relevant event objects based on the component's state
  const myEvents = eventsById.filter((event) => sportPage.get('eventIds').includes(event.get('id')));
  console.log('myEvents', myEvents);

  // Create a map using event group id as keys
  eventGroupsById.forEach((eventGroup) => {
    const eventGroupId = eventGroup.get('id');
    if (sportPage.get('eventGroupIds').includes(eventGroupId)) {
      page[eventGroupId] = { name: eventGroup.get('name') };
      page[eventGroupId]['events'] = [];
    }
  });

  // For each event, generate data entry for the Simple Betting Widget
  myEvents.forEach((event) => {
    if (page.hasOwnProperty(event.get('event_group_id'))) {
      page[event.get('event_group_id')]['events'].push({
        id: event.get('id'),
        name: event.get('name'),
        time: event.get('start_time'),
        offers: findBinnedOrderBooksFromEvent(event, state)
      });
    }
  });

  console.log('mapStateToProps', page);

  return {
    sport: sportName,
    eventGroups: page
  };
}

export default connect(mapStateToProps)(Sport);
