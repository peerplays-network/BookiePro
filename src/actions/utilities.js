import FakeApi from '../communication/FakeApi';
import _ from 'lodash';

const getEventsBySports = (sports) => {
  // Create promise to get events for each sport and call them together
  return Promise.all(sports.map((sport) => FakeApi.getEvents(sport.id)));
};

const getBettingMarketGroupsByEvents = (events) => {
  // Create promise to get betting market groups for each event and call them together
  return Promise.all(events.map((event) => FakeApi.getObjects(event.betting_market_group_ids)));
}

const getBettingMarketsInBettingMarketGroups = (bettingMarketGroups) => {
  // Create promise to get betting markets for each groupC and call them together
  return Promise.all(bettingMarketGroups.map((group) => FakeApi.getObjects(group.betting_market_ids)));
}

const getBinnedOrderBooksByBettingMarkets = (bettingMarkets) => {
  // Create promise to get Binned Order Books for each market and call them together
  return Promise.all(bettingMarkets.map((market) => FakeApi.getBinnedOrderBook(market.id, 2)));
}

const groupBinnedOrderBooksByBettingMarketId = (binnedOrderBooks) => {
  const map = {};
  binnedOrderBooks.forEach((binnedOrderBook) => {
    const betting_market_id = binnedOrderBook.betting_market_id;
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
