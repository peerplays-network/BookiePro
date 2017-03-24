import FakeApi from '../communication/FakeApi';
import _ from 'lodash';

const getEventsBySports = (sports) => {
  // Create promise to get events for each sports
  let getEventsPromiseArray = [];
  _.forEach(sports, (sport) => {
    const getEventsPromise = FakeApi.getEvents(sport.id);
    getEventsPromiseArray.push(getEventsPromise);
  });

  // Call the promise together
  return Promise.all(getEventsPromiseArray);
};

const getBettingMarketGroupsByEvents = (events) => {
  // Create promise to get betting market groups for each event
  let getBettingMarketGroupPromiseArray = [];
  _.forEach(events, (event) => {
    const getBettingMarketGroupPromise = FakeApi.getObjects(event.betting_market_group_ids);
    getBettingMarketGroupPromiseArray.push(getBettingMarketGroupPromise);
  });

  // Call the promise together
  return Promise.all(getBettingMarketGroupPromiseArray);
}

const getBettingMarketsInBettingMarketGroups = (bettingMarketGroups) => {
  // Create promise to get betting markets for each group
  let getBettingMarketPromiseArray = [];
  _.forEach(bettingMarketGroups, (group) => {
    const getBettingMarketPromise = FakeApi.getObjects(group.betting_market_ids);
    getBettingMarketPromiseArray.push(getBettingMarketPromise);
  });

  // Call the promises together
  return Promise.all(getBettingMarketPromiseArray);
}

const getBinnedOrderBooksByBettingMarkets = (bettingMarkets) => {
  // Create promise to get Binned Order Books for each market
  let getBinnedOrderBookPromiseArray = [];
  _.forEach(bettingMarkets, (market) => {
    const getBinnedOrderBookPromise = FakeApi.getBinnedOrderBook(market.id, 2);
    getBinnedOrderBookPromiseArray.push(getBinnedOrderBookPromise);
  });

  // Call the promises together
  return Promise.all(getBinnedOrderBookPromiseArray);
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
