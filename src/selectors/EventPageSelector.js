import { createSelector } from 'reselect';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';
import _ from 'lodash';
import { SportsbookUtils } from '../utility';

const {
  getBettingMarketsById,
  // getBinnedOrderBooksByBettingMarketId,
} = CommonSelector;

const getEvent = (state, id) => state.getIn(['event', 'eventsById', id]);

const getBettingMarketGroupsByEventId = (state, ownProps) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  const eventId = ownProps.params.eventId;

  let bettingMarkets = Immutable.List();
  bmgs.valueSeq().forEach((bettingMarket, index) => {
    if (bettingMarket.get('event_id') === eventId) {
      bettingMarkets = bettingMarkets.push(bettingMarket);
    }
  });
  return bettingMarkets;
};

const getBettingMarketsByBMGID = createSelector([getBettingMarketsById], bettingMarkets => {
  let bettingMarketsByGroupID = {};

  bettingMarkets.forEach(bettingMarket => {
    const groupID = bettingMarket.get('group_id');

    if (!bettingMarketsByGroupID[groupID]) {
      bettingMarketsByGroupID[groupID] = [];
    }

    bettingMarketsByGroupID[groupID].push(bettingMarket);
  });
  return bettingMarketsByGroupID;
});

const getMarketData = createSelector(
  [
    getBettingMarketGroupsByEventId,
    getBettingMarketsByBMGID,
    // getBinnedOrderBooksByBettingMarketId
  ],
  (
    bettingMarketGroups,
    // bettingMarkets is a dictionary
    //    - Where the keys are BMG ID's
    //    - Where the values are arrays that contain all of the BM's that pertain to the BMG
    bettingMarkets

    // binnedOrderBooksByBettingMarketId
  ) => {
    // Iterate through the list of betting market groups and...
    bettingMarketGroups.forEach((bmg, index) => {
      // Pick the betting markets out of the dictionary that pertain to the given BMG
      bettingMarketGroups = bettingMarketGroups.set(index, bmg.set('bettingMarkets', bettingMarkets[bmg.get('id')]));
    });

    bettingMarketGroups = SportsbookUtils.groupOverUnders(bettingMarketGroups);

    return bettingMarketGroups;
  }
);

const EventPageSelector = {
  getEvent,
  getMarketData,
  getBettingMarketGroupsByEventId,
};

export default EventPageSelector;
