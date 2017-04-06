import { CommunicationService } from '../services';
import _ from 'lodash';
import Immutable from 'immutable';

const getEventsBySports = (sports) => {
  // Create promise to get events for each sport and call them together
  return Promise.all(sports.map((sport) => CommunicationService.getEventsBySportIds(sport.get('id'))));
};

const getBettingMarketGroupsByEvents = (events) => {
  // Concatenate betting market group ids and call get objects api
  const bettingMarketGroupIds = _.flatMap(events, (event) => event.get('betting_market_group_ids').toJS());
  return CommunicationService.getObjectsByIds(bettingMarketGroupIds);
}

const getBettingMarketsInBettingMarketGroups = (bettingMarketGroups) => {
  // Concatenate betting market ids and call get objects api
  const bettingMarketIds = _.flatMap(bettingMarketGroups, (bettingMarketGroup) => {
    return bettingMarketGroup.get('betting_market_ids').toJS()
  });
  return CommunicationService.getObjectsByIds(bettingMarketIds);
}

const getBinnedOrderBooksByBettingMarkets = (bettingMarkets) => {
  // Create promise to get Binned Order Books for each market and call them together
  return Promise.all(bettingMarkets.map((market) => CommunicationService.getBinnedOrderBook(market.get('id'), 2))).then(result => Immutable.fromJS(_.omitBy(result, _.isNil)));
}

const groupBinnedOrderBooksByBettingMarketId = (binnedOrderBooks) => {
  const map = {};
  binnedOrderBooks.forEach((binnedOrderBook) => {
    const betting_market_id = binnedOrderBook.get('betting_market_id');
    map[betting_market_id] = binnedOrderBook;
  });
  return map;
}

const groupBinnedOrderBooksByEvent = (event, bettingMarketGroups, binnedOrderBooks) => {
  const matchedBettingMarketGroups = bettingMarketGroups.filter(
    (group) => event.get('betting_market_group_ids').includes(group.get('id'))
  );

  let bettingMarketIds = Immutable.List();
  matchedBettingMarketGroups.forEach((group) => {
    bettingMarketIds = bettingMarketIds.concat(group.get('betting_market_ids'));
  });

  let groupedBinnedOrderBooks = Immutable.List();
  bettingMarketIds.forEach((bettingMarketId) => {
    if (binnedOrderBooks.hasOwnProperty(bettingMarketId)) {
      const orderBook = binnedOrderBooks[bettingMarketId];
      let immutableOrderBook = Immutable.Map();
      // TODO: the actual orderBook dummy data are still in plain JS Object
      immutableOrderBook = immutableOrderBook.set('back', orderBook.get('aggregated_back_bets'));
      immutableOrderBook = immutableOrderBook.set('lay', orderBook.get('aggregated_lay_bets'));
      groupedBinnedOrderBooks = groupedBinnedOrderBooks.push(immutableOrderBook);
    }
  });

  return groupedBinnedOrderBooks;
}

export {
  getEventsBySports,
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId,
  groupBinnedOrderBooksByEvent
};
