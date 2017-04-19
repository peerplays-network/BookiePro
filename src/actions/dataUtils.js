import _ from 'lodash';
import Immutable from 'immutable';

const groupMoneyLineBinnedOrderBooks = (event, bettingMarketGroups, binnedOrderBooksByBettingMarketId) => {
  // Get the Moneyline betting market group
  const moneyline = bettingMarketGroups.find(
    (group) => event.get('betting_market_group_ids').includes(group.get('id')) &&
               group.get('market_type_id').toUpperCase() === 'MONEYLINE'
  );

  let groupedBinnedOrderBooks = Immutable.List();
  // Implicit Rule: the first betting market is for the home team
  moneyline.get('betting_market_ids').forEach((bettingMarketId) => {
    let immutableOrderBook = Immutable.Map();
    const orderBook = binnedOrderBooksByBettingMarketId.get(bettingMarketId);
    if (orderBook === undefined) {
      immutableOrderBook = immutableOrderBook
                            .set('back', Immutable.List())
                            .set('lay', Immutable.List());
    } else {
      immutableOrderBook = immutableOrderBook
                            .set('back', orderBook.get('aggregated_back_bets'))
                            .set('lay', orderBook.get('aggregated_lay_bets'));
    }
    groupedBinnedOrderBooks = groupedBinnedOrderBooks.push(immutableOrderBook);
  });
  return groupedBinnedOrderBooks;
}

export {
  groupMoneyLineBinnedOrderBooks
};
