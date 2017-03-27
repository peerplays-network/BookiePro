import FakeApi from '../communication/FakeApi';
import _ from 'lodash';

const getEventsBySports = (sports) => {
  // Create promise to get events for each sport and call them together
  return Promise.all(sports.map((sport) => FakeApi.getEvents(sport.get('id'))));
};

const getBettingMarketGroupsByEvents = (events) => {
  // Concatenate betting market group ids and call get objects api
  const bettingMarketGroupIds = _.flatMap(events, (event) => event.get('betting_market_group_ids').toJS());
  return FakeApi.getObjects(bettingMarketGroupIds);
}

const getBettingMarketsInBettingMarketGroups = (bettingMarketGroups) => {
  // Concatenate betting market ids and call get objects api
  const bettingMarketIds = _.flatMap(bettingMarketGroups, (bettingMarketGroup) => {
    return bettingMarketGroup.get('betting_market_ids').toJS()
  });
  return FakeApi.getObjects(bettingMarketIds);
}

const getBinnedOrderBooksByBettingMarkets = (bettingMarkets) => {
  // Create promise to get Binned Order Books for each market and call them together
  return Promise.all(bettingMarkets.map((market) => FakeApi.getBinnedOrderBook(market.get('id'), 2)));
}

const groupBinnedOrderBooksByBettingMarketId = (binnedOrderBooks) => {
  const map = {};
  binnedOrderBooks.forEach((binnedOrderBook) => {
    const betting_market_id = binnedOrderBook.get('betting_market_id');
    map[betting_market_id] = binnedOrderBook;
  });
  return map;
}

export {
  getEventsBySports,
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId
};
