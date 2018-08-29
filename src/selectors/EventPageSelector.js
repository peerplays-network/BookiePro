import { createSelector } from 'reselect';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';
import _ from 'lodash';
import { SportsbookUtils } from '../utility';
import { Config } from '../constants';

const {
  getBettingMarketsById,
  getBinnedOrderBooksByBettingMarketId,
} = CommonSelector;

const getEvent = (state, id) => state.getIn(['event', 'eventsById', id]);

const getEventIdByFromBMGId = (state, id) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  let foundEventID = -1;
  bmgs.valueSeq().forEach(bettingMarket => {
    if (bettingMarket.get('id') === id) {
      foundEventID = bettingMarket.get('event_id');
    }
  });
  return foundEventID;
};

const getBettingMarketGroupsByEventId = (state, ownProps) => {
  const bmgs = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  const eventId = ownProps.params.eventId;

  let bettingMarkets = Immutable.List();
  bmgs.valueSeq().forEach(bettingMarket => {
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
    getBinnedOrderBooksByBettingMarketId
  ],
  (
    bettingMarketGroups,
    // bettingMarkets is a dictionary
    //    - Where the keys are BMG ID's
    //    - Where the values are arrays that contain all of the BM's that pertain to the BMG
    bettingMarkets,

    binnedOrderBooksByBettingMarketId
  ) => {

    // Iterate through the values of the bettingMarkets dictionary
    Object.values(bettingMarkets).forEach(bm => {
      // There are one or more bm in a single betting market group, this loop matches them
      //  with the order book that pertains to the BM.
      for (let i  = 0; i < bm.length; i++) {
        bm[i] = bm[i].set('orderBook', binnedOrderBooksByBettingMarketId.get(bm[i].get('id')));

        // We only care about the lay bets (the bets that will display as open back bets)
        let aggregated_lay_bets = bm[i].getIn(['orderBook', 'aggregated_lay_bets']);

        if (aggregated_lay_bets) {
          aggregated_lay_bets = aggregated_lay_bets.map(aggregated_lay_bet => {
            const odds = aggregated_lay_bet.get('backer_multiplier') / Config.oddsPrecision;
            return aggregated_lay_bet.set('odds', odds);
          });
          bm[i] = bm[i].set('backOrigin', aggregated_lay_bets.sort((a, b) => a.get('odds') - b.get('odds')));
        }
      }
    });

    // Iterate through the list of betting market groups and...
    bettingMarketGroups.forEach((bmg, index) => {
      // Pick the betting markets out of the dictionary that pertain to the given BMG
      bettingMarketGroups = bettingMarketGroups.set(index, bmg.set('bettingMarkets', bettingMarkets[bmg.get('id')]));
    });

    // Group all of the over under BMGs as if they belonged to the same BMG.
    bettingMarketGroups = SportsbookUtils.groupOverUnders(bettingMarketGroups);

    // Sort the betting market groups so they appear in priority order (ex. Match odds at top)
    bettingMarketGroups = SportsbookUtils.prioritySort(bettingMarketGroups);

    bettingMarketGroups.forEach(bmg => {
      // If there is a betting market group that belongs to match odds
      if (SportsbookUtils.isMatchodds(bmg)) {
        // The draw needs to be centered
        bmg = SportsbookUtils.centerTheDraw(bmg);
      }
    });

    return bettingMarketGroups;
  }
);

const EventPageSelector = {
  getEvent,
  getMarketData,
  getBettingMarketGroupsByEventId,
  getEventIdByFromBMGId
};

export default EventPageSelector;
