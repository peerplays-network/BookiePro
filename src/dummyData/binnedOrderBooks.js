import _ from 'lodash';
import Immutable from 'immutable';

// TODO: Replace this with the real definition of order_book_bin
//       with amount_to_bet and amount_to_win
const createOrderBookBin = (odds, price) => ({
  odds: odds,
  price: price
});

// We don't have a unique key for these as they are NOT Blockchain object
const binnedOrderBooks = [
  {
    betting_market_id: '1.105.1',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.2',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.7',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.8',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.13',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.14',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.19',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.20',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.25',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.26',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.55',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.56',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.61',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.62',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    betting_market_id: '1.105.67',
    aggregated_back_bets: [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    aggregated_lay_bets: [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    betting_market_id: '1.105.68',
    aggregated_back_bets: [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    aggregated_lay_bets: [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  }
];

//TODO: add more in this list, pay attention on the relation with the betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

const immutableBinnedOrderBooks = _.map(binnedOrderBooks, binnedOrderBook => Immutable.fromJS(binnedOrderBook));
export default immutableBinnedOrderBooks;
