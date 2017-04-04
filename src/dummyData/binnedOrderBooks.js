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
    "betting_market_id": "1.105.27",
    "aggregated_back_bets": [createOrderBookBin(5.23, 0.91), createOrderBookBin(2.3, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(4.26, 0.49), createOrderBookBin(2.8, 0.29)]
  },
  {
    "betting_market_id": "1.105.28",
    "aggregated_back_bets": [createOrderBookBin(5.81, 0.74), createOrderBookBin(5.23, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(3.7, 0.48), createOrderBookBin(3.0, 0.237)]
  },
  {
    "betting_market_id": "1.105.29",
    "aggregated_back_bets": [createOrderBookBin(5.89, 0.69), createOrderBookBin(2.21, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(3.1, 1), createOrderBookBin(2.3, 0.21)]
  },
  {
    "betting_market_id": "1.105.30",
    "aggregated_back_bets": [createOrderBookBin(4.46, 1), createOrderBookBin(2.5, 0.89)],
    "aggregated_lay_bets": [createOrderBookBin(4.29, 1), createOrderBookBin(3.52, 0.21)]
  },
  {
    "betting_market_id": "1.105.31",
    "aggregated_back_bets": [createOrderBookBin(5.8, 0.59), createOrderBookBin(4.19, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.72), createOrderBookBin(2.87, 0.59)]
  },
  {
    "betting_market_id": "1.105.32",
    "aggregated_back_bets": [createOrderBookBin(4.6, 0.666), createOrderBookBin(3.74, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(3.49, 1), createOrderBookBin(2.85, 0.16)]
  },
  {
    "betting_market_id": "1.105.33",
    "aggregated_back_bets": [createOrderBookBin(4.5, 0.34), createOrderBookBin(2.5, 0.32)],
    "aggregated_lay_bets": [createOrderBookBin(4.29, 0.974), createOrderBookBin(2.34, 0.449)]
  },
  {
    "betting_market_id": "1.105.34",
    "aggregated_back_bets": [createOrderBookBin(3.09, 0.91), createOrderBookBin(2.89, 0.82)],
    "aggregated_lay_bets": [createOrderBookBin(4.32, 0.35), createOrderBookBin(2.89, 0.25)]
  },
  {
    "betting_market_id": "1.105.35",
    "aggregated_back_bets": [createOrderBookBin(5.31, 0.95), createOrderBookBin(2.8, 0.237)],
    "aggregated_lay_bets": [createOrderBookBin(4.13, 0.71), createOrderBookBin(4.0, 0.52)]
  },
  {
    "betting_market_id": "1.105.36",
    "aggregated_back_bets": [createOrderBookBin(4.7, 0.63), createOrderBookBin(2.8, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(4.39, 0.77), createOrderBookBin(3.5, 0.329)]
  },
  {
    "betting_market_id": "1.105.37",
    "aggregated_back_bets": [createOrderBookBin(4.9, 0.63), createOrderBookBin(3.9, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(4.13, 0.8), createOrderBookBin(3.6, 0.72)]
  },
  {
    "betting_market_id": "1.105.38",
    "aggregated_back_bets": [createOrderBookBin(4.7, 0.71), createOrderBookBin(3.7, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(5.7, 0.85), createOrderBookBin(2.58, 0.07)]
  },
  {
    "betting_market_id": "1.105.39",
    "aggregated_back_bets": [createOrderBookBin(4.65, 0.87), createOrderBookBin(2.25, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(4.5, 0.7), createOrderBookBin(3.2, 0.34)]
  },
  {
    "betting_market_id": "1.105.40",
    "aggregated_back_bets": [createOrderBookBin(5.3, 0.91), createOrderBookBin(4.31, 0.82)],
    "aggregated_lay_bets": [createOrderBookBin(4.13, 0.92), createOrderBookBin(3.4, 0.21)]
  },
  {
    "betting_market_id": "1.105.41",
    "aggregated_back_bets": [createOrderBookBin(3.4, 0.59), createOrderBookBin(2.16, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(3.16, 0.91), createOrderBookBin(2.71, 0.21)]
  },
  {
    "betting_market_id": "1.105.42",
    "aggregated_back_bets": [createOrderBookBin(4.13, 0.77), createOrderBookBin(3.8, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(5.80, 0.35), createOrderBookBin(4.36, 0.29)]
  },
  {
    "betting_market_id": "1.105.43",
    "aggregated_back_bets": [createOrderBookBin(5.89, 0.46), createOrderBookBin(5.2, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(5.8, 0.58), createOrderBookBin(2.74, 0)]
  },
  {
    "betting_market_id": "1.105.44",
    "aggregated_back_bets": [createOrderBookBin(2.58, 0.8), createOrderBookBin(2.1, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(4.22, 0.46), createOrderBookBin(2.04, 0.241)]
  },
  {
    "betting_market_id": "1.105.45",
    "aggregated_back_bets": [createOrderBookBin(4.68, 0.69), createOrderBookBin(4.29, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(5.8, 0.8), createOrderBookBin(5.2, 0.553)]
  },
  {
    "betting_market_id": "1.105.46",
    "aggregated_back_bets": [createOrderBookBin(5.16, 0.63), createOrderBookBin(3.99, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(3.0, 0.97), createOrderBookBin(2.1, 0.26)]
  },
  {
    "betting_market_id": "1.105.47",
    "aggregated_back_bets": [createOrderBookBin(2.90, 0.85), createOrderBookBin(2.8, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(5.80, 0.29), createOrderBookBin(4.24, 0.21)]
  },
  {
    "betting_market_id": "1.105.48",
    "aggregated_back_bets": [createOrderBookBin(3.3, 0.82), createOrderBookBin(2.68, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(4.09, 0.88), createOrderBookBin(2.04, 0.449)]
  },
  {
    "betting_market_id": "1.105.49",
    "aggregated_back_bets": [createOrderBookBin(5.82, 0.82), createOrderBookBin(2.70, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(5.52, 0.974), createOrderBookBin(4.5, 0.96)]
  },
  {
    "betting_market_id": "1.105.50",
    "aggregated_back_bets": [createOrderBookBin(5.90, 0.48), createOrderBookBin(3.09, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(3.4, 0.73), createOrderBookBin(2.16, 0.59)]
  },
  {
    "betting_market_id": "1.105.51",
    "aggregated_back_bets": [createOrderBookBin(4.6, 0.96), createOrderBookBin(2.2, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(5.00, 0.59), createOrderBookBin(3.29, 0.101)]
  },
  {
    "betting_market_id": "1.105.52",
    "aggregated_back_bets": [createOrderBookBin(5.32, 0.769), createOrderBookBin(4.39, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(5.33, 0.9), createOrderBookBin(2.68, 0.84)]
  },
  {
    "betting_market_id": "1.105.53",
    "aggregated_back_bets": [createOrderBookBin(4.7, 0.85), createOrderBookBin(2.55, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(5.4, 0.69), createOrderBookBin(4.13, 0.36)]
  },
  {
    "betting_market_id": "1.105.54",
    "aggregated_back_bets": [createOrderBookBin(4.69, 0.974), createOrderBookBin(2.72, 0.36)],
    "aggregated_lay_bets": [createOrderBookBin(3.82, 0.47), createOrderBookBin(3.49, 0.003)]
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
  },
  {
    "betting_market_id": "1.105.69",
    "aggregated_back_bets": [createOrderBookBin(5.00, 0.55), createOrderBookBin(3.68, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(9.30, 0.73), createOrderBookBin(4.69, 0.36)]
  },
  {
    "betting_market_id": "1.105.70",
    "aggregated_back_bets": [createOrderBookBin(8.87, 0.553), createOrderBookBin(8.34, 0.49)],
    "aggregated_lay_bets": [createOrderBookBin(2.11, 0.24), createOrderBookBin(1.33, 0.09)]
  },
  {
    "betting_market_id": "1.105.71",
    "aggregated_back_bets": [createOrderBookBin(8.72, 0.82), createOrderBookBin(8.16, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(9.59, 0.91), createOrderBookBin(2.80, 0.82)]
  },
  {
    "betting_market_id": "1.105.72",
    "aggregated_back_bets": [createOrderBookBin(8.16, 0.63), createOrderBookBin(5.3, 0.564)],
    "aggregated_lay_bets": [createOrderBookBin(2.59, 0.34), createOrderBookBin(1.36, 0.34)]
  },
  {
    "betting_market_id": "1.105.73",
    "aggregated_back_bets": [createOrderBookBin(8.13, 0.47), createOrderBookBin(5.92, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.62), createOrderBookBin(7.39, 0.295)]
  },
  {
    "betting_market_id": "1.105.74",
    "aggregated_back_bets": [createOrderBookBin(5.84, 0.89), createOrderBookBin(4.96, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(1.2, 0.80), createOrderBookBin(1.19, 0.35)]
  },
  {
    "betting_market_id": "1.105.75",
    "aggregated_back_bets": [createOrderBookBin(7.19, 0.91), createOrderBookBin(4.74, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(7.39, 0.666), createOrderBookBin(1.59, 0.295)]
  },
  {
    "betting_market_id": "1.105.76",
    "aggregated_back_bets": [createOrderBookBin(2.65, 0.81), createOrderBookBin(2.1, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.85), createOrderBookBin(5.97, 0.69)]
  },
  {
    "betting_market_id": "1.105.77",
    "aggregated_back_bets": [createOrderBookBin(7.19, 0.65), createOrderBookBin(5.52, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(9.59, 0.11), createOrderBookBin(7.09, 0.04)]
  },
  {
    "betting_market_id": "1.105.78",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.52), createOrderBookBin(5.92, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(8.5, 0.91), createOrderBookBin(3.77, 0.32)]
  },
  {
    "betting_market_id": "1.105.79",
    "aggregated_back_bets": [createOrderBookBin(8.65, 0.97), createOrderBookBin(7.3, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(6.6, 0.34), createOrderBookBin(2.29, 0.13)]
  },
  {
    "betting_market_id": "1.105.80",
    "aggregated_back_bets": [createOrderBookBin(9.59, 0.35), createOrderBookBin(8.65, 0.211)],
    "aggregated_lay_bets": [createOrderBookBin(8.16, 0.85), createOrderBookBin(4.82, 0.31)]
  },
  {
    "betting_market_id": "1.105.81",
    "aggregated_back_bets": [createOrderBookBin(6.65, 0.63), createOrderBookBin(6.6, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(8.13, 0.65), createOrderBookBin(1.59, 0.48)]
  },
  {
    "betting_market_id": "1.105.82",
    "aggregated_back_bets": [createOrderBookBin(5.00, 0.24), createOrderBookBin(2.72, 0.1)],
    "aggregated_lay_bets": [createOrderBookBin(7.39, 0.88), createOrderBookBin(3.46, 0.21)]
  },
  {
    "betting_market_id": "1.105.83",
    "aggregated_back_bets": [createOrderBookBin(8.72, 0.91), createOrderBookBin(2.11, 0.564)],
    "aggregated_lay_bets": [createOrderBookBin(4.1, 0.42), createOrderBookBin(2.3, 0.19)]
  },
  {
    "betting_market_id": "1.105.84",
    "aggregated_back_bets": [createOrderBookBin(9.8, 0.769), createOrderBookBin(4.35, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(3.22, 0.87), createOrderBookBin(1.21, 0.39)]
  },
  {
    "betting_market_id": "1.105.85",
    "aggregated_back_bets": [createOrderBookBin(8.65, 0.25), createOrderBookBin(2.11, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(2.65, 0.769), createOrderBookBin(2.3, 0.22)]
  },
  {
    "betting_market_id": "1.105.86",
    "aggregated_back_bets": [createOrderBookBin(4.6, 0.59), createOrderBookBin(2.11, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(8.55, 0.45), createOrderBookBin(5.00, 0.39)]
  },
  {
    "betting_market_id": "1.105.87",
    "aggregated_back_bets": [createOrderBookBin(6.6, 0.95), createOrderBookBin(2.1, 0.57)],
    "aggregated_lay_bets": [createOrderBookBin(3.5, 0.92), createOrderBookBin(1.88, 0.666)]
  },
  {
    "betting_market_id": "1.105.88",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.71), createOrderBookBin(9.09, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(9.29, 0.96), createOrderBookBin(6.34, 0.85)]
  },
  {
    "betting_market_id": "1.105.89",
    "aggregated_back_bets": [createOrderBookBin(5.48, 0.81), createOrderBookBin(1.59, 0.586)],
    "aggregated_lay_bets": [createOrderBookBin(9.7, 0.59), createOrderBookBin(7.19, 0.59)]
  },
  {
    "betting_market_id": "1.105.90",
    "aggregated_back_bets": [createOrderBookBin(8.49, 0.73), createOrderBookBin(2.59, 0.1)],
    "aggregated_lay_bets": [createOrderBookBin(8.16, 0.92), createOrderBookBin(5.1, 0.92)]
  },
  {
    "betting_market_id": "1.105.91",
    "aggregated_back_bets": [createOrderBookBin(2.9, 0.237), createOrderBookBin(1.74, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(9.59, 0.99), createOrderBookBin(1.33, 0.9)]
  },
  {
    "betting_market_id": "1.105.92",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.48), createOrderBookBin(2.65, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(6.65, 0.49), createOrderBookBin(6.13, 0.32)]
  },
  {
    "betting_market_id": "1.105.93",
    "aggregated_back_bets": [createOrderBookBin(9.10, 0.57), createOrderBookBin(8.35, 0.49)],
    "aggregated_lay_bets": [createOrderBookBin(4.59, 0.99), createOrderBookBin(4.3, 0.21)]
  },
  {
    "betting_market_id": "1.105.94",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.91), createOrderBookBin(3.22, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(4.74, 0.19), createOrderBookBin(2.19, 0.11)]
  },
  {
    "betting_market_id": "1.105.95",
    "aggregated_back_bets": [createOrderBookBin(6.48, 0.553), createOrderBookBin(3.22, 0.329)],
    "aggregated_lay_bets": [createOrderBookBin(4.6, 0.96), createOrderBookBin(2.19, 0.91)]
  },
  {
    "betting_market_id": "1.105.96",
    "aggregated_back_bets": [createOrderBookBin(5.48, 0.72), createOrderBookBin(4.34, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(4.59, 0.72), createOrderBookBin(1.19, 0.59)]
  },
  {
    "betting_market_id": "1.105.97",
    "aggregated_back_bets": [createOrderBookBin(5.97, 0.71), createOrderBookBin(2.91, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(7.47, 0.8), createOrderBookBin(6.59, 0.11)]
  },
  {
    "betting_market_id": "1.105.98",
    "aggregated_back_bets": [createOrderBookBin(9.30, 0.39), createOrderBookBin(6.82, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(9.07, 1), createOrderBookBin(2.9, 0.3)]
  },
  {
    "betting_market_id": "1.105.99",
    "aggregated_back_bets": [createOrderBookBin(9.73, 0.72), createOrderBookBin(1.33, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(4.69, 0.69), createOrderBookBin(1.58, 0.101)]
  },
  {
    "betting_market_id": "1.105.100",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.89), createOrderBookBin(6.19, 0.73)],
    "aggregated_lay_bets": [createOrderBookBin(4.69, 0.057), createOrderBookBin(4.1, 0.04)]
  },
  {
    "betting_market_id": "1.105.101",
    "aggregated_back_bets": [createOrderBookBin(3.68, 0.63), createOrderBookBin(3.5, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(9.09, 0.73), createOrderBookBin(4.59, 0.72)]
  },
  {
    "betting_market_id": "1.105.102",
    "aggregated_back_bets": [createOrderBookBin(4.69, 0.82), createOrderBookBin(2.26, 0.71)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.69), createOrderBookBin(3.24, 0.35)]
  },
  //baseball
  {
    "betting_market_id": "1.105.103",
    "aggregated_back_bets": [createOrderBookBin(8.0, 0.34), createOrderBookBin(4.2, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.47), createOrderBookBin(2.5, 0.13)]
  },
  {
    "betting_market_id": "1.105.104",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.21), createOrderBookBin(4.8, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.25), createOrderBookBin(4.2, 0.1)]
  },
  {
    "betting_market_id": "1.105.105",
    "aggregated_back_bets": [createOrderBookBin(5.5, 0.77), createOrderBookBin(2.88, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(5.4, 0.974), createOrderBookBin(2.5, 0.81)]
  },
  {
    "betting_market_id": "1.105.106",
    "aggregated_back_bets": [createOrderBookBin(7.6, 0.9), createOrderBookBin(2.9, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(5.33, 0.72), createOrderBookBin(3.87, 0.666)]
  },
  {
    "betting_market_id": "1.105.107",
    "aggregated_back_bets": [createOrderBookBin(7.29, 0.87), createOrderBookBin(3.7, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(7.11, 0.72), createOrderBookBin(5.5, 0.241)]
  },
  {
    "betting_market_id": "1.105.108",
    "aggregated_back_bets": [createOrderBookBin(9.59, 0.69), createOrderBookBin(8.3, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(9.47, 0.63), createOrderBookBin(6.33, 0.21)]
  },
  {
    "betting_market_id": "1.105.109",
    "aggregated_back_bets": [createOrderBookBin(6.1, 0.99), createOrderBookBin(3.6, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.34), createOrderBookBin(3.9, 0.13)]
  },
  {
    "betting_market_id": "1.105.110",
    "aggregated_back_bets": [createOrderBookBin(9.99, 0.35), createOrderBookBin(5.32, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(8.90, 0.47), createOrderBookBin(2.31, 0.241)]
  },
  {
    "betting_market_id": "1.105.111",
    "aggregated_back_bets": [createOrderBookBin(9.22, 0.89), createOrderBookBin(8.8, 0.36)],
    "aggregated_lay_bets": [createOrderBookBin(7.9, 0.553), createOrderBookBin(5.5, 0.21)]
  },
  {
    "betting_market_id": "1.105.112",
    "aggregated_back_bets": [createOrderBookBin(7.10, 0.59), createOrderBookBin(2.73, 0.49)],
    "aggregated_lay_bets": [createOrderBookBin(7.8, 0.65), createOrderBookBin(2.55, 0.49)]
  },
  {
    "betting_market_id": "1.105.113",
    "aggregated_back_bets": [createOrderBookBin(3.1, 0.87), createOrderBookBin(2.4, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(7.47, 0.71), createOrderBookBin(6.07, 0.49)]
  },
  {
    "betting_market_id": "1.105.114",
    "aggregated_back_bets": [createOrderBookBin(7.8, 0.85), createOrderBookBin(5.3, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(5.72, 0.49), createOrderBookBin(5.2, 0.28)]
  },
  {
    "betting_market_id": "1.105.115",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.52), createOrderBookBin(6.5, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(4.6, 0.68), createOrderBookBin(2.28, 0.101)]
  },
  {
    "betting_market_id": "1.105.116",
    "aggregated_back_bets": [createOrderBookBin(7.2, 0.72), createOrderBookBin(3.69, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(8.07, 0.34), createOrderBookBin(6.99, 0.07)]
  },
  {
    "betting_market_id": "1.105.117",
    "aggregated_back_bets": [createOrderBookBin(5.00, 0.91), createOrderBookBin(3.89, 0.73)],
    "aggregated_lay_bets": [createOrderBookBin(7.59, 0.49), createOrderBookBin(4.80, 0.39)]
  },
  {
    "betting_market_id": "1.105.118",
    "aggregated_back_bets": [createOrderBookBin(5.55, 0.449), createOrderBookBin(2.46, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(7.2, 0.8), createOrderBookBin(4.49, 0.23)]
  },
  {
    "betting_market_id": "1.105.119",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.87), createOrderBookBin(2.16, 0.82)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.81), createOrderBookBin(4.77, 0.55)]
  },
  {
    "betting_market_id": "1.105.120",
    "aggregated_back_bets": [createOrderBookBin(6.3, 0.7), createOrderBookBin(2.13, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(9.11, 0.47), createOrderBookBin(6.6, 0.34)]
  },
  {
    "betting_market_id": "1.105.121",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.97), createOrderBookBin(9.3, 0.81)],
    "aggregated_lay_bets": [createOrderBookBin(7.99, 0.28), createOrderBookBin(5.3, 0.13)]
  },
  {
    "betting_market_id": "1.105.122",
    "aggregated_back_bets": [createOrderBookBin(8.58, 0.85), createOrderBookBin(7.26, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(5.80, 0.77), createOrderBookBin(3.33, 0.59)]
  },
  {
    "betting_market_id": "1.105.123",
    "aggregated_back_bets": [createOrderBookBin(9.47, 0.96), createOrderBookBin(7.84, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(8.97, 0.59), createOrderBookBin(2.9, 0.11)]
  },
  {
    "betting_market_id": "1.105.124",
    "aggregated_back_bets": [createOrderBookBin(7.73, 0.295), createOrderBookBin(4.07, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(9.49, 0.97), createOrderBookBin(5.4, 0.55)]
  },
  {
    "betting_market_id": "1.105.125",
    "aggregated_back_bets": [createOrderBookBin(6.3, 0.72), createOrderBookBin(5.3, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(9.25, 0.49), createOrderBookBin(3.35, 0.449)]
  },
  {
    "betting_market_id": "1.105.126",
    "aggregated_back_bets": [createOrderBookBin(5.39, 0.7), createOrderBookBin(4.2, 0.58)],
    "aggregated_lay_bets": [createOrderBookBin(4.82, 0.29), createOrderBookBin(4.7, 0.26)]
  },
  {
    "betting_market_id": "1.105.127",
    "aggregated_back_bets": [createOrderBookBin(5.97, 0.21), createOrderBookBin(4.0, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(5.91, 0.59), createOrderBookBin(2.5, 0.52)]
  },
  {
    "betting_market_id": "1.105.128",
    "aggregated_back_bets": [createOrderBookBin(8.63, 0.82), createOrderBookBin(3.65, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.666), createOrderBookBin(5.2, 0.101)]
  },
  {
    "betting_market_id": "1.105.129",
    "aggregated_back_bets": [createOrderBookBin(3.80, 0.95), createOrderBookBin(3.59, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(9.19, 0.91), createOrderBookBin(7.80, 0.23)]
  },
  {
    "betting_market_id": "1.105.130",
    "aggregated_back_bets": [createOrderBookBin(3.6, 0.25), createOrderBookBin(3.34, 0.23)],
    "aggregated_lay_bets": [createOrderBookBin(9.11, 0.47), createOrderBookBin(4.3, 0.23)]
  },
  {
    "betting_market_id": "1.105.131",
    "aggregated_back_bets": [createOrderBookBin(5.2, 0.8), createOrderBookBin(4.59, 0.74)],
    "aggregated_lay_bets": [createOrderBookBin(9.7, 0.449), createOrderBookBin(5.4, 0.16)]
  },
  {
    "betting_market_id": "1.105.132",
    "aggregated_back_bets": [createOrderBookBin(4.77, 0.46), createOrderBookBin(2.13, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.81), createOrderBookBin(7.72, 0.666)]
  },
  {
    "betting_market_id": "1.105.133",
    "aggregated_back_bets": [createOrderBookBin(8.36, 0.91), createOrderBookBin(5.35, 0.69)],
    "aggregated_lay_bets": [createOrderBookBin(9.29, 0.7), createOrderBookBin(5.70, 0.58)]
  },
  {
    "betting_market_id": "1.105.134",
    "aggregated_back_bets": [createOrderBookBin(4.96, 0.72), createOrderBookBin(2.71, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(7.49, 0.586), createOrderBookBin(5.34, 0.11)]
  },
  {
    "betting_market_id": "1.105.135",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.21), createOrderBookBin(5.1, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(9.6, 0.329), createOrderBookBin(6.2, 0.19)]
  },
  {
    "betting_market_id": "1.105.136",
    "aggregated_back_bets": [createOrderBookBin(7.30, 0.73), createOrderBookBin(6.04, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(4.11, 0.89), createOrderBookBin(3.91, 0.82)]
  },
  {
    "betting_market_id": "1.105.137",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.89), createOrderBookBin(7.11, 0.295)],
    "aggregated_lay_bets": [createOrderBookBin(7.2, 0.72), createOrderBookBin(3.0, 0.72)]
  },
  {
    "betting_market_id": "1.105.138",
    "aggregated_back_bets": [createOrderBookBin(9.5, 0.449), createOrderBookBin(5.81, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(9.71, 0.81), createOrderBookBin(3.13, 0.26)]
  },
  {
    "betting_market_id": "1.105.139",
    "aggregated_back_bets": [createOrderBookBin(7.8, 0.97), createOrderBookBin(5.21, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(5.0, 0.29), createOrderBookBin(3.91, 0.13)]
  },
  {
    "betting_market_id": "1.105.140",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.91), createOrderBookBin(2.21, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(3.34, 0.211), createOrderBookBin(2.49, 0.21)]
  },
  {
    "betting_market_id": "1.105.141",
    "aggregated_back_bets": [createOrderBookBin(9.49, 0.72), createOrderBookBin(3.5, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.329), createOrderBookBin(2.58, 0.21)]
  },
  {
    "betting_market_id": "1.105.142",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.97), createOrderBookBin(9.3, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(9.80, 0.564), createOrderBookBin(7.3, 0.24)]
  },
  {
    "betting_market_id": "1.105.143",
    "aggregated_back_bets": [createOrderBookBin(5.80, 0.72), createOrderBookBin(3.19, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(3.04, 0.73), createOrderBookBin(2.8, 0.25)]
  },
  {
    "betting_market_id": "1.105.144",
    "aggregated_back_bets": [createOrderBookBin(9.52, 0.3), createOrderBookBin(7.91, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(9.1, 0.59), createOrderBookBin(7.0, 0.22)]
  },
  {
    "betting_market_id": "1.105.145",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.46), createOrderBookBin(2.2, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(5.88, 0.99), createOrderBookBin(4.04, 0.28)]
  },
  {
    "betting_market_id": "1.105.146",
    "aggregated_back_bets": [createOrderBookBin(6.0, 0.34), createOrderBookBin(3.3, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(7.26, 0.34), createOrderBookBin(6.48, 0.28)]
  },
  {
    "betting_market_id": "1.105.147",
    "aggregated_back_bets": [createOrderBookBin(8.59, 0.47), createOrderBookBin(7.46, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(7.0, 0.99), createOrderBookBin(3.0, 0.57)]
  },
  {
    "betting_market_id": "1.105.148",
    "aggregated_back_bets": [createOrderBookBin(8.2, 0.57), createOrderBookBin(5.39, 0.564)],
    "aggregated_lay_bets": [createOrderBookBin(7.00, 0.95), createOrderBookBin(2.49, 0.58)]
  },
  {
    "betting_market_id": "1.105.149",
    "aggregated_back_bets": [createOrderBookBin(7.6, 0.72), createOrderBookBin(7.2, 0.69)],
    "aggregated_lay_bets": [createOrderBookBin(3.3, 0.47), createOrderBookBin(2.87, 0.35)]
  },
  {
    "betting_market_id": "1.105.150",
    "aggregated_back_bets": [createOrderBookBin(7.99, 0.564), createOrderBookBin(2.6, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(7.39, 0.69), createOrderBookBin(2.55, 0.58)]
  },
  {
    "betting_market_id": "1.105.151",
    "aggregated_back_bets": [createOrderBookBin(6.6, 0.59), createOrderBookBin(5.80, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(6.8, 0.88), createOrderBookBin(5.25, 0.553)]
  },
  {
    "betting_market_id": "1.105.152",
    "aggregated_back_bets": [createOrderBookBin(8.97, 0.96), createOrderBookBin(8.13, 0.77)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.8), createOrderBookBin(6.7, 0.39)]
  },
  {
    "betting_market_id": "1.105.153",
    "aggregated_back_bets": [createOrderBookBin(4.3, 0.34), createOrderBookBin(3.3, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(6.82, 0.92), createOrderBookBin(4.46, 0.46)]
  },
  {
    "betting_market_id": "1.105.154",
    "aggregated_back_bets": [createOrderBookBin(6.46, 0.48), createOrderBookBin(2.0, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(6.21, 0.82), createOrderBookBin(5.6, 0.04)]
  },
  {
    "betting_market_id": "1.105.155",
    "aggregated_back_bets": [createOrderBookBin(7.72, 0.449), createOrderBookBin(5.5, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(9.7, 0.69), createOrderBookBin(6.4, 0.29)]
  },
  {
    "betting_market_id": "1.105.156",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.81), createOrderBookBin(7.39, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(8.33, 0.974), createOrderBookBin(6.88, 0.8)]
  },
  {
    "betting_market_id": "1.105.157",
    "aggregated_back_bets": [createOrderBookBin(7.55, 0.81), createOrderBookBin(4.6, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(9.46, 0.91), createOrderBookBin(7.8, 0.63)]
  },
  {
    "betting_market_id": "1.105.158",
    "aggregated_back_bets": [createOrderBookBin(8.8, 0.666), createOrderBookBin(3.23, 0.553)],
    "aggregated_lay_bets": [createOrderBookBin(7.73, 0.55), createOrderBookBin(6.39, 0.46)]
  },
  {
    "betting_market_id": "1.105.159",
    "aggregated_back_bets": [createOrderBookBin(8.5, 0.974), createOrderBookBin(6.88, 0.74)],
    "aggregated_lay_bets": [createOrderBookBin(7.29, 0.57), createOrderBookBin(2.9, 0.21)]
  },
  {
    "betting_market_id": "1.105.160",
    "aggregated_back_bets": [createOrderBookBin(9.39, 0.29), createOrderBookBin(7.3, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.84), createOrderBookBin(5.21, 0.25)]
  },
  {
    "betting_market_id": "1.105.161",
    "aggregated_back_bets": [createOrderBookBin(7.1, 0.47), createOrderBookBin(5.1, 0.23)],
    "aggregated_lay_bets": [createOrderBookBin(5.52, 0.95), createOrderBookBin(4.47, 0.52)]
  },
  {
    "betting_market_id": "1.105.162",
    "aggregated_back_bets": [createOrderBookBin(6.99, 0.9), createOrderBookBin(3.1, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(7.59, 0.29), createOrderBookBin(5.77, 0.09)]
  },
  //soccer
  {
    "betting_market_id": "1.105.163",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.49), createOrderBookBin(6.2, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(6.3, 0.72), createOrderBookBin(5.0, 0.7)]
  },
  {
    "betting_market_id": "1.105.164",
    "aggregated_back_bets": [createOrderBookBin(4.09, 0.63), createOrderBookBin(2.26, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(5.97, 0.85), createOrderBookBin(2.3, 0.63)]
  },
  {
    "betting_market_id": "1.105.165",
    "aggregated_back_bets": [createOrderBookBin(6.2, 0.69), createOrderBookBin(2.82, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(3.35, 0.11), createOrderBookBin(2.85, 0.1)]
  },
  {
    "betting_market_id": "1.105.166",
    "aggregated_back_bets": [createOrderBookBin(4.35, 0.72), createOrderBookBin(3.34, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(4.5, 0.449), createOrderBookBin(4.5, 0.29)]
  },
  {
    "betting_market_id": "1.105.167",
    "aggregated_back_bets": [createOrderBookBin(4.9, 0.9), createOrderBookBin(2.3, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.32), createOrderBookBin(5.3, 0.19)]
  },
  {
    "betting_market_id": "1.105.168",
    "aggregated_back_bets": [createOrderBookBin(6.65, 0.74), createOrderBookBin(2.52, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.73), createOrderBookBin(5.47, 0.59)]
  },
  {
    "betting_market_id": "1.105.169",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.81), createOrderBookBin(2.00, 0)],
    "aggregated_lay_bets": [createOrderBookBin(3.91, 0.99), createOrderBookBin(3.2, 0.46)]
  },
  {
    "betting_market_id": "1.105.170",
    "aggregated_back_bets": [createOrderBookBin(3.00, 0.34), createOrderBookBin(2.2, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(4.7, 0.99), createOrderBookBin(2.4, 0.72)]
  },
  {
    "betting_market_id": "1.105.171",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.85), createOrderBookBin(3.28, 0)],
    "aggregated_lay_bets": [createOrderBookBin(6.81, 0.55), createOrderBookBin(5.35, 0.09)]
  },
  {
    "betting_market_id": "1.105.172",
    "aggregated_back_bets": [createOrderBookBin(6.71, 0.81), createOrderBookBin(4.5, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(6.4, 0.65), createOrderBookBin(3.8, 0.59)]
  },
  {
    "betting_market_id": "1.105.173",
    "aggregated_back_bets": [createOrderBookBin(6.80, 0.666), createOrderBookBin(2.9, 0.329)],
    "aggregated_lay_bets": [createOrderBookBin(5.92, 0.52), createOrderBookBin(3.29, 0.52)]
  },
  {
    "betting_market_id": "1.105.174",
    "aggregated_back_bets": [createOrderBookBin(3.92, 0.65), createOrderBookBin(2.3, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.564), createOrderBookBin(2.92, 0.1)]
  },
  {
    "betting_market_id": "1.105.175",
    "aggregated_back_bets": [createOrderBookBin(6.35, 0.23), createOrderBookBin(2.25, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.59), createOrderBookBin(4.30, 0.057)]
  },
  {
    "betting_market_id": "1.105.176",
    "aggregated_back_bets": [createOrderBookBin(6.69, 0.81), createOrderBookBin(4.7, 0.57)],
    "aggregated_lay_bets": [createOrderBookBin(5.91, 0.449), createOrderBookBin(3.00, 0.1)]
  },
  {
    "betting_market_id": "1.105.177",
    "aggregated_back_bets": [createOrderBookBin(6.2, 0.666), createOrderBookBin(5.4, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(4.48, 0.69), createOrderBookBin(3.6, 0.32)]
  },
  {
    "betting_market_id": "1.105.178",
    "aggregated_back_bets": [createOrderBookBin(5.2, 0.8), createOrderBookBin(3.96, 0.295)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.22), createOrderBookBin(4.3, 0.11)]
  },
  {
    "betting_market_id": "1.105.179",
    "aggregated_back_bets": [createOrderBookBin(6.96, 1), createOrderBookBin(2.9, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.85), createOrderBookBin(5.52, 0.329)]
  },
  {
    "betting_market_id": "1.105.180",
    "aggregated_back_bets": [createOrderBookBin(6.1, 0.95), createOrderBookBin(6.1, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(5.63, 0.7), createOrderBookBin(3.8, 0.29)]
  },
  {
    "betting_market_id": "1.105.181",
    "aggregated_back_bets": [createOrderBookBin(7.0, 0.69), createOrderBookBin(3.5, 0.26)],
    "aggregated_lay_bets": [createOrderBookBin(6.3, 0.7), createOrderBookBin(3.4, 0.003)]
  },
  {
    "betting_market_id": "1.105.182",
    "aggregated_back_bets": [createOrderBookBin(3.29, 0.32), createOrderBookBin(2.3, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(6.34, 0.7), createOrderBookBin(5.5, 0.59)]
  },
  {
    "betting_market_id": "1.105.183",
    "aggregated_back_bets": [createOrderBookBin(4.7, 0.553), createOrderBookBin(2.5, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(2.65, 0.23), createOrderBookBin(2.6, 0.101)]
  },
  {
    "betting_market_id": "1.105.184",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.99), createOrderBookBin(2.5, 0.69)],
    "aggregated_lay_bets": [createOrderBookBin(3.26, 0.92), createOrderBookBin(3.22, 0.26)]
  },
  {
    "betting_market_id": "1.105.185",
    "aggregated_back_bets": [createOrderBookBin(3.81, 1), createOrderBookBin(2.39, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(6.3, 0.52), createOrderBookBin(4.5, 0.48)]
  },
  {
    "betting_market_id": "1.105.186",
    "aggregated_back_bets": [createOrderBookBin(4.68, 0.91), createOrderBookBin(4.2, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(6.68, 0.85), createOrderBookBin(5.91, 0.59)]
  },
  {
    "betting_market_id": "1.105.187",
    "aggregated_back_bets": [createOrderBookBin(3.72, 0.59), createOrderBookBin(3.70, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(5.24, 0.46), createOrderBookBin(2.4, 0.07)]
  },
  {
    "betting_market_id": "1.105.188",
    "aggregated_back_bets": [createOrderBookBin(6.11, 0.666), createOrderBookBin(5.29, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(5.8, 0.69), createOrderBookBin(3.2, 0.32)]
  },
  {
    "betting_market_id": "1.105.189",
    "aggregated_back_bets": [createOrderBookBin(3.1, 0.7), createOrderBookBin(2.4, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.63), createOrderBookBin(2.7, 0.35)]
  },
  {
    "betting_market_id": "1.105.190",
    "aggregated_back_bets": [createOrderBookBin(3.7, 0.47), createOrderBookBin(3.6, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(2.72, 0.29), createOrderBookBin(2.04, 0.16)]
  },
  {
    "betting_market_id": "1.105.191",
    "aggregated_back_bets": [createOrderBookBin(5.47, 0.88), createOrderBookBin(4.6, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(5.0, 0.89), createOrderBookBin(3.3, 0.59)]
  },
  {
    "betting_market_id": "1.105.192",
    "aggregated_back_bets": [createOrderBookBin(6.63, 0.21), createOrderBookBin(5.7, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(5.70, 0.101), createOrderBookBin(4.3, 0.07)]
  },
  {
    "betting_market_id": "1.105.193",
    "aggregated_back_bets": [createOrderBookBin(2.91, 0.89), createOrderBookBin(2.59, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.52), createOrderBookBin(5.24, 0.241)]
  },
  {
    "betting_market_id": "1.105.194",
    "aggregated_back_bets": [createOrderBookBin(6.9, 0.96), createOrderBookBin(6.33, 0.81)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.87), createOrderBookBin(5.89, 0.85)]
  },
  {
    "betting_market_id": "1.105.195",
    "aggregated_back_bets": [createOrderBookBin(5.21, 0.47), createOrderBookBin(3.2, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(3.97, 0.52), createOrderBookBin(3.0, 0.04)]
  },
  {
    "betting_market_id": "1.105.196",
    "aggregated_back_bets": [createOrderBookBin(6.11, 0.82), createOrderBookBin(2.5, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(6.46, 0.31), createOrderBookBin(6.1, 0.09)]
  },
  {
    "betting_market_id": "1.105.197",
    "aggregated_back_bets": [createOrderBookBin(6.82, 0.22), createOrderBookBin(2.77, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(3.13, 0.97), createOrderBookBin(3.0, 0.69)]
  },
  {
    "betting_market_id": "1.105.198",
    "aggregated_back_bets": [createOrderBookBin(5.70, 0.7), createOrderBookBin(3.6, 0.48)],
    "aggregated_lay_bets": [createOrderBookBin(5.28, 0.769), createOrderBookBin(2.07, 0.68)]
  },
  {
    "betting_market_id": "1.105.199",
    "aggregated_back_bets": [createOrderBookBin(6.74, 0.59), createOrderBookBin(6.7, 0.211)],
    "aggregated_lay_bets": [createOrderBookBin(3.35, 0.74), createOrderBookBin(2.68, 0.13)]
  },
  {
    "betting_market_id": "1.105.200",
    "aggregated_back_bets": [createOrderBookBin(4.7, 0.72), createOrderBookBin(2.9, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(3.9, 0.92), createOrderBookBin(2.6, 0.74)]
  },
  {
    "betting_market_id": "1.105.201",
    "aggregated_back_bets": [createOrderBookBin(4.0, 0.564), createOrderBookBin(3.91, 0.329)],
    "aggregated_lay_bets": [createOrderBookBin(4.1, 0.72), createOrderBookBin(3.96, 0.09)]
  },
  {
    "betting_market_id": "1.105.202",
    "aggregated_back_bets": [createOrderBookBin(5.3, 0.07), createOrderBookBin(4.58, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(5.3, 0.59), createOrderBookBin(3.5, 0.21)]
  },
  {
    "betting_market_id": "1.105.203",
    "aggregated_back_bets": [createOrderBookBin(4.49, 0.769), createOrderBookBin(3.6, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.81), createOrderBookBin(3.0, 0.101)]
  },
  {
    "betting_market_id": "1.105.204",
    "aggregated_back_bets": [createOrderBookBin(5.13, 0.48), createOrderBookBin(3.29, 0.057)],
    "aggregated_lay_bets": [createOrderBookBin(6.8, 0.74), createOrderBookBin(3.7, 0.666)]
  },
  {
    "betting_market_id": "1.105.205",
    "aggregated_back_bets": [createOrderBookBin(4.2, 0.07), createOrderBookBin(3.1, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.295), createOrderBookBin(2.4, 0.23)]
  },
  {
    "betting_market_id": "1.105.206",
    "aggregated_back_bets": [createOrderBookBin(3.2, 0.7), createOrderBookBin(3.09, 0.211)],
    "aggregated_lay_bets": [createOrderBookBin(4.0, 0.91), createOrderBookBin(3.0, 0.85)]
  },
  {
    "betting_market_id": "1.105.207",
    "aggregated_back_bets": [createOrderBookBin(2.29, 0.73), createOrderBookBin(2.09, 0.295)],
    "aggregated_lay_bets": [createOrderBookBin(4.0, 0.87), createOrderBookBin(2.59, 0.553)]
  },
  {
    "betting_market_id": "1.105.208",
    "aggregated_back_bets": [createOrderBookBin(3.92, 1), createOrderBookBin(3.2, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.85), createOrderBookBin(4.6, 0.71)]
  },
  {
    "betting_market_id": "1.105.209",
    "aggregated_back_bets": [createOrderBookBin(3.5, 0.85), createOrderBookBin(3.35, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(3.5, 0.553), createOrderBookBin(3.1, 0.33)]
  },
  {
    "betting_market_id": "1.105.210",
    "aggregated_back_bets": [createOrderBookBin(5.7, 0.97), createOrderBookBin(2.7, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(5.3, 0.91), createOrderBookBin(2.81, 0.241)]
  },
  {
    "betting_market_id": "1.105.211",
    "aggregated_back_bets": [createOrderBookBin(6.58, 0.666), createOrderBookBin(3.57, 0.057)],
    "aggregated_lay_bets": [createOrderBookBin(6.59, 0.25), createOrderBookBin(2.5, 0.11)]
  },
  {
    "betting_market_id": "1.105.212",
    "aggregated_back_bets": [createOrderBookBin(6.74, 0.89), createOrderBookBin(3.70, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(6.0, 0.91), createOrderBookBin(4.5, 0.26)]
  },
  {
    "betting_market_id": "1.105.213",
    "aggregated_back_bets": [createOrderBookBin(3.29, 0.564), createOrderBookBin(2.7, 0.48)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.85), createOrderBookBin(2.52, 0.29)]
  },
  {
    "betting_market_id": "1.105.214",
    "aggregated_back_bets": [createOrderBookBin(6.80, 0.46), createOrderBookBin(2.25, 0.211)],
    "aggregated_lay_bets": [createOrderBookBin(2.23, 0.68), createOrderBookBin(2.07, 0.449)]
  },
  {
    "betting_market_id": "1.105.215",
    "aggregated_back_bets": [createOrderBookBin(4.3, 0.3), createOrderBookBin(3.47, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(3.95, 0.52), createOrderBookBin(3.8, 0.3)]
  },
  {
    "betting_market_id": "1.105.216",
    "aggregated_back_bets": [createOrderBookBin(5.70, 0.89), createOrderBookBin(3.2, 0.329)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.7), createOrderBookBin(5.9, 0.11)]
  },
  {
    "betting_market_id": "1.105.217",
    "aggregated_back_bets": [createOrderBookBin(5.29, 0.25), createOrderBookBin(4.5, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.47), createOrderBookBin(4.2, 0.07)]
  },
  {
    "betting_market_id": "1.105.218",
    "aggregated_back_bets": [createOrderBookBin(6.91, 0.3), createOrderBookBin(5.13, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(5.97, 0.8), createOrderBookBin(2.5, 0.77)]
  },
  {
    "betting_market_id": "1.105.219",
    "aggregated_back_bets": [createOrderBookBin(3.3, 0.85), createOrderBookBin(2.3, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(2.9, 0.68), createOrderBookBin(2.21, 0.586)]
  },
  {
    "betting_market_id": "1.105.220",
    "aggregated_back_bets": [createOrderBookBin(6.99, 0.25), createOrderBookBin(5.3, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(6.3, 0.237), createOrderBookBin(5.33, 0.09)]
  },
  {
    "betting_market_id": "1.105.221",
    "aggregated_back_bets": [createOrderBookBin(6.96, 0.77), createOrderBookBin(6.48, 0.39)],
    "aggregated_lay_bets": [createOrderBookBin(6.09, 0.57), createOrderBookBin(3.8, 0.22)]
  },
  {
    "betting_market_id": "1.105.222",
    "aggregated_back_bets": [createOrderBookBin(2.91, 0.72), createOrderBookBin(2.8, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.95), createOrderBookBin(5.3, 0.52)]
  }
];

//TODO: add more in this list, pay attention on the relation with the betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

const immutableBinnedOrderBooks = _.map(binnedOrderBooks, binnedOrderBook => Immutable.fromJS(binnedOrderBook));
export default immutableBinnedOrderBooks;
