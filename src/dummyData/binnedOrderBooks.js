
// TODO: Replace this with the real definition of order_book_bin
//       with amount_to_bet and amount_to_win
const createOrderBookBin = (odds, price) => ({
  odds: odds,
  price: price
});

// We don't have a unique key for these as they are NOT Blockchain object
const binnedOrderBooks = [
  {
    "betting_market_id": "1.105.1",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.2",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.7",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.8",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.13",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.14",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.19",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.20",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.25",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.26",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
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
    "betting_market_id": "1.105.55",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.56",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.61",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.62",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
  },
  {
    "betting_market_id": "1.105.67",
    "aggregated_back_bets": [createOrderBookBin(3.25, 0.173), createOrderBookBin(3.10, 0.082)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.25), createOrderBookBin(2.10, 0.056)]
  },
  {
    "betting_market_id": "1.105.68",
    "aggregated_back_bets": [createOrderBookBin(3.01, 0.23), createOrderBookBin(1.76, 0.06)],
    "aggregated_lay_bets": [createOrderBookBin(2.19, 0.023), createOrderBookBin(1.9, 0.17)]
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
    "aggregated_back_bets": [createOrderBookBin(3.1, 0.25), createOrderBookBin(3.25, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(2.89, 0.769), createOrderBookBin(2.1, 0.22)]
  },
  {
    "betting_market_id": "1.105.86",
    "aggregated_back_bets": [createOrderBookBin(4.8, 0.59), createOrderBookBin(4.9, 0.19), createOrderBookBin(5.0, 0.19), createOrderBookBin(5.1, 0.19), createOrderBookBin(5.2, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(1.44, 0.45), createOrderBookBin(1.43, 0.39), createOrderBookBin(1.42, 0.39), createOrderBookBin(1.41, 0.39), createOrderBookBin(1.40, 0.39)]
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
  },
  {
    "betting_market_id": "1.105.223",
    "aggregated_back_bets": [createOrderBookBin(4.8, 0.59)],
    "aggregated_lay_bets": []
  },
  {
    "betting_market_id": "1.105.224",
    "aggregated_back_bets": [createOrderBookBin(6.8, 0.87), createOrderBookBin(5.95, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(9.13, 0.22), createOrderBookBin(2.9, 0.21)]
  },
  {
    "betting_market_id": "1.105.225",
    "aggregated_back_bets": [createOrderBookBin(8.0, 0.69), createOrderBookBin(2.1, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(7.7, 0.65), createOrderBookBin(6.49, 0.237)]
  },
  {
    "betting_market_id": "1.105.226",
    "aggregated_back_bets": [createOrderBookBin(7.1, 0.91), createOrderBookBin(2.3, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(9.28, 0.29), createOrderBookBin(7.8, 0)]
  },
  {
    "betting_market_id": "1.105.227",
    "aggregated_back_bets": [createOrderBookBin(9.34, 0.71), createOrderBookBin(5.7, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.47), createOrderBookBin(5.1, 0.29)]
  },
  {
    "betting_market_id": "1.105.228",
    "aggregated_back_bets": [createOrderBookBin(8.8, 0.91), createOrderBookBin(6.34, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(8.58, 0.55), createOrderBookBin(7.85, 0.22)]
  },
  {
    "betting_market_id": "1.105.229",
    "aggregated_back_bets": [createOrderBookBin(9.72, 0.33), createOrderBookBin(2.88, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(4.07, 0.95), createOrderBookBin(3.9, 0.72)]
  },
  {
    "betting_market_id": "1.105.230",
    "aggregated_back_bets": [createOrderBookBin(3.8, 0.97), createOrderBookBin(3.07, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(8.6, 0.82), createOrderBookBin(7.5, 0.003)]
  },
  {
    "betting_market_id": "1.105.231",
    "aggregated_back_bets": [createOrderBookBin(4.82, 0.91), createOrderBookBin(2.55, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(9.11, 0.92), createOrderBookBin(2.81, 0.48)]
  },
  {
    "betting_market_id": "1.105.232",
    "aggregated_back_bets": [createOrderBookBin(9.29, 0.92), createOrderBookBin(2.23, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(9.3, 0.35), createOrderBookBin(5.9, 0.23)]
  },
  {
    "betting_market_id": "1.105.233",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.564), createOrderBookBin(9.6, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(5.6, 0.85), createOrderBookBin(2.7, 0.7)]
  },
  {
    "betting_market_id": "1.105.234",
    "aggregated_back_bets": [createOrderBookBin(9.87, 0.73), createOrderBookBin(6.72, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(8.70, 0.8), createOrderBookBin(7.69, 0.29)]
  },
  {
    "betting_market_id": "1.105.235",
    "aggregated_back_bets": [createOrderBookBin(7.59, 0.46), createOrderBookBin(6.19, 0.26)],
    "aggregated_lay_bets": [createOrderBookBin(7.5, 0.7), createOrderBookBin(6.3, 0.21)]
  },
  {
    "betting_market_id": "1.105.236",
    "aggregated_back_bets": [createOrderBookBin(6.04, 0.48), createOrderBookBin(3.9, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(8.70, 0.36), createOrderBookBin(3.11, 0.24)]
  },
  {
    "betting_market_id": "1.105.237",
    "aggregated_back_bets": [createOrderBookBin(4.5, 0.82), createOrderBookBin(4.26, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(5.29, 0.974), createOrderBookBin(4.6, 0.46)]
  },
  {
    "betting_market_id": "1.105.238",
    "aggregated_back_bets": [createOrderBookBin(4.6, 0.48), createOrderBookBin(2.6, 0.26)],
    "aggregated_lay_bets": [createOrderBookBin(5.29, 0.553), createOrderBookBin(4.09, 0.295)]
  },
  {
    "betting_market_id": "1.105.239",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.91), createOrderBookBin(2.3, 0.8)],
    "aggregated_lay_bets": [createOrderBookBin(7.5, 0.28), createOrderBookBin(4.3, 0.101)]
  },
  {
    "betting_market_id": "1.105.240",
    "aggregated_back_bets": [createOrderBookBin(7.9, 0.71), createOrderBookBin(2.0, 0.26)],
    "aggregated_lay_bets": [createOrderBookBin(6.19, 0.85), createOrderBookBin(2.6, 0.33)]
  },
  {
    "betting_market_id": "1.105.241",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.59), createOrderBookBin(2.25, 0.23)],
    "aggregated_lay_bets": [createOrderBookBin(4.47, 0.55), createOrderBookBin(4.25, 0.11)]
  },
  {
    "betting_market_id": "1.105.242",
    "aggregated_back_bets": [createOrderBookBin(9.26, 0.85), createOrderBookBin(3.99, 0.7)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.69), createOrderBookBin(5.7, 0.58)]
  },
  {
    "betting_market_id": "1.105.243",
    "aggregated_back_bets": [createOrderBookBin(7.47, 0.57), createOrderBookBin(4.48, 0.57)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.72), createOrderBookBin(4.9, 0.16)]
  },
  {
    "betting_market_id": "1.105.244",
    "aggregated_back_bets": [createOrderBookBin(7.4, 0.25), createOrderBookBin(10.0, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(8.48, 0.88), createOrderBookBin(4.32, 0.72)]
  },
  {
    "betting_market_id": "1.105.245",
    "aggregated_back_bets": [createOrderBookBin(2.81, 0.769), createOrderBookBin(2.80, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(3.4, 0.88), createOrderBookBin(2.3, 0.25)]
  },
  {
    "betting_market_id": "1.105.246",
    "aggregated_back_bets": [createOrderBookBin(8.11, 0.82), createOrderBookBin(6.5, 0.586)],
    "aggregated_lay_bets": [createOrderBookBin(4.48, 0.85), createOrderBookBin(3.3, 0.07)]
  },
  {
    "betting_market_id": "1.105.247",
    "aggregated_back_bets": [createOrderBookBin(6.26, 0.91), createOrderBookBin(6.00, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(8.90, 0.88), createOrderBookBin(7.9, 0.295)]
  },
  {
    "betting_market_id": "1.105.248",
    "aggregated_back_bets": [createOrderBookBin(5.1, 0.72), createOrderBookBin(3.9, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(5.3, 0.96), createOrderBookBin(5.1, 0.769)]
  },
  {
    "betting_market_id": "1.105.249",
    "aggregated_back_bets": [createOrderBookBin(9.81, 0.85), createOrderBookBin(7.00, 0.32)],
    "aggregated_lay_bets": [createOrderBookBin(7.5, 0.36), createOrderBookBin(3.47, 0.07)]
  },
  {
    "betting_market_id": "1.105.250",
    "aggregated_back_bets": [createOrderBookBin(4.29, 1), createOrderBookBin(3.25, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(6.1, 0.28), createOrderBookBin(2.3, 0.11)]
  },
  {
    "betting_market_id": "1.105.251",
    "aggregated_back_bets": [createOrderBookBin(9.21, 0.564), createOrderBookBin(3.6, 0.23)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.58), createOrderBookBin(9.26, 0.241)]
  },
  {
    "betting_market_id": "1.105.252",
    "aggregated_back_bets": [createOrderBookBin(3.5, 0.8), createOrderBookBin(2.55, 0.69)],
    "aggregated_lay_bets": [createOrderBookBin(9.7, 0.69), createOrderBookBin(5.8, 0.59)]
  },
  //Basketball Event group 3
  {
    "betting_market_id": "1.105.253",
    "aggregated_back_bets": [createOrderBookBin(8.34, 0.36), createOrderBookBin(6.1, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(3.95, 0.8), createOrderBookBin(2.72, 0.13)]
  },
  {
    "betting_market_id": "1.105.254",
    "aggregated_back_bets": [createOrderBookBin(6.19, 0.63), createOrderBookBin(3.07, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(5.85, 0.586), createOrderBookBin(4.3, 0.057)]
  },
  {
    "betting_market_id": "1.105.255",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.39), createOrderBookBin(5.1, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(6.39, 0.974), createOrderBookBin(3.81, 0.81)]
  },
  {
    "betting_market_id": "1.105.256",
    "aggregated_back_bets": [createOrderBookBin(7.4, 0.63), createOrderBookBin(5.36, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(7.22, 0.26), createOrderBookBin(5.49, 0.23)]
  },
  {
    "betting_market_id": "1.105.257",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.65), createOrderBookBin(4.7, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(9.59, 0.101), createOrderBookBin(7.55, 0.04)]
  },
  {
    "betting_market_id": "1.105.258",
    "aggregated_back_bets": [createOrderBookBin(7.47, 0.88), createOrderBookBin(3.80, 0.84)],
    "aggregated_lay_bets": [createOrderBookBin(9.96, 0.8), createOrderBookBin(3.69, 0.564)]
  },
  {
    "betting_market_id": "1.105.259",
    "aggregated_back_bets": [createOrderBookBin(8.07, 0.39), createOrderBookBin(3.9, 0.057)],
    "aggregated_lay_bets": [createOrderBookBin(6.26, 0.55), createOrderBookBin(5.58, 0.46)]
  },
  {
    "betting_market_id": "1.105.260",
    "aggregated_back_bets": [createOrderBookBin(6.85, 0.16), createOrderBookBin(5.5, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(9.6, 0.16), createOrderBookBin(4.82, 0.07)]
  },
  {
    "betting_market_id": "1.105.261",
    "aggregated_back_bets": [createOrderBookBin(6.2, 0.88), createOrderBookBin(3.34, 0.71)],
    "aggregated_lay_bets": [createOrderBookBin(6.69, 0.24), createOrderBookBin(3.69, 0.11)]
  },
  {
    "betting_market_id": "1.105.262",
    "aggregated_back_bets": [createOrderBookBin(9.29, 0.72), createOrderBookBin(5.9, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.769), createOrderBookBin(4.58, 0.21)]
  },
  {
    "betting_market_id": "1.105.263",
    "aggregated_back_bets": [createOrderBookBin(8.0, 0.72), createOrderBookBin(3.22, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(9.5, 0.21), createOrderBookBin(5.59, 0.101)]
  },
  {
    "betting_market_id": "1.105.264",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.74), createOrderBookBin(7.99, 0.553)],
    "aggregated_lay_bets": [createOrderBookBin(5.5, 0.72), createOrderBookBin(3.95, 0.09)]
  },
  {
    "betting_market_id": "1.105.265",
    "aggregated_back_bets": [createOrderBookBin(7.55, 0.85), createOrderBookBin(5.09, 0.1)],
    "aggregated_lay_bets": [createOrderBookBin(8.3, 0.87), createOrderBookBin(4.7, 0.47)]
  },
  {
    "betting_market_id": "1.105.266",
    "aggregated_back_bets": [createOrderBookBin(5.9, 0.81), createOrderBookBin(5.3, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(4.2, 0.23), createOrderBookBin(2.2, 0.057)]
  },
  {
    "betting_market_id": "1.105.267",
    "aggregated_back_bets": [createOrderBookBin(9.16, 0.59), createOrderBookBin(7.28, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.57), createOrderBookBin(5.5, 0.28)]
  },
  {
    "betting_market_id": "1.105.268",
    "aggregated_back_bets": [createOrderBookBin(5.73, 0.71), createOrderBookBin(4.7, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(7.8, 1), createOrderBookBin(2.88, 0.82)]
  },
  {
    "betting_market_id": "1.105.269",
    "aggregated_back_bets": [createOrderBookBin(6.2, 0.35), createOrderBookBin(4.80, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.47), createOrderBookBin(7.72, 0.33)]
  },
  {
    "betting_market_id": "1.105.270",
    "aggregated_back_bets": [createOrderBookBin(9.35, 0.77), createOrderBookBin(5.3, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(9.82, 0.96), createOrderBookBin(6.7, 0.25)]
  },
  {
    "betting_market_id": "1.105.271",
    "aggregated_back_bets": [createOrderBookBin(7.00, 0.81), createOrderBookBin(2.5, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(8.1, 0.25), createOrderBookBin(4.2, 0.13)]
  },
  {
    "betting_market_id": "1.105.272",
    "aggregated_back_bets": [createOrderBookBin(7.19, 0.74), createOrderBookBin(2.5, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(8.99, 0.97), createOrderBookBin(8.6, 0.39)]
  },
  {
    "betting_market_id": "1.105.273",
    "aggregated_back_bets": [createOrderBookBin(7.3, 0.59), createOrderBookBin(4.09, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(7.5, 0.52), createOrderBookBin(4.34, 0.21)]
  },
  {
    "betting_market_id": "1.105.274",
    "aggregated_back_bets": [createOrderBookBin(8.63, 0.32), createOrderBookBin(6.90, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(7.82, 0.81), createOrderBookBin(3.6, 0.25)]
  },
  {
    "betting_market_id": "1.105.275",
    "aggregated_back_bets": [createOrderBookBin(8.72, 0.71), createOrderBookBin(3.52, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(6.16, 0.23), createOrderBookBin(4.29, 0.09)]
  },
  {
    "betting_market_id": "1.105.276",
    "aggregated_back_bets": [createOrderBookBin(6.59, 0.47), createOrderBookBin(2.29, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(2.9, 0.46), createOrderBookBin(2.47, 0.449)]
  },
  {
    "betting_market_id": "1.105.277",
    "aggregated_back_bets": [createOrderBookBin(7.22, 0.329), createOrderBookBin(6.10, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(4.0, 0.81), createOrderBookBin(2.6, 0.09)]
  },
  {
    "betting_market_id": "1.105.278",
    "aggregated_back_bets": [createOrderBookBin(9.21, 0.666), createOrderBookBin(4.97, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(5.35, 0.237), createOrderBookBin(4.32, 0)]
  },
  {
    "betting_market_id": "1.105.279",
    "aggregated_back_bets": [createOrderBookBin(8.21, 0.58), createOrderBookBin(7.88, 0.39)],
    "aggregated_lay_bets": [createOrderBookBin(5.72, 0.72), createOrderBookBin(2.7, 0.47)]
  },
  {
    "betting_market_id": "1.105.280",
    "aggregated_back_bets": [createOrderBookBin(4.80, 0.057), createOrderBookBin(10.0, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(5.5, 0.73), createOrderBookBin(3.69, 0.25)]
  },
  {
    "betting_market_id": "1.105.281",
    "aggregated_back_bets": [createOrderBookBin(8.5, 0.769), createOrderBookBin(5.25, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(7.25, 0.8), createOrderBookBin(4.80, 0.58)]
  },
  {
    "betting_market_id": "1.105.282",
    "aggregated_back_bets": [createOrderBookBin(4.9, 0.25), createOrderBookBin(4.47, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(7.34, 0.47), createOrderBookBin(3.34, 0.07)]
  },
  //Soccer Event group 2
  {
    "betting_market_id": "1.105.283",
    "aggregated_back_bets": [createOrderBookBin(3.8, 0.89), createOrderBookBin(3.0, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.46), createOrderBookBin(8.13, 0.13)]
  },
  {
    "betting_market_id": "1.105.284",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.46), createOrderBookBin(3.5, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.52), createOrderBookBin(2.81, 0.24)]
  },
  {
    "betting_market_id": "1.105.285",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.34), createOrderBookBin(2.8, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(6.23, 0.63), createOrderBookBin(3.16, 0.46)]
  },
  {
    "betting_market_id": "1.105.286",
    "aggregated_back_bets": [createOrderBookBin(5.2, 0.82), createOrderBookBin(2.87, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(2.9, 0.55), createOrderBookBin(2.6, 0.32)]
  },
  {
    "betting_market_id": "1.105.287",
    "aggregated_back_bets": [createOrderBookBin(6.49, 0.59), createOrderBookBin(3.8, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.34), createOrderBookBin(5.9, 0.21)]
  },
  {
    "betting_market_id": "1.105.288",
    "aggregated_back_bets": [createOrderBookBin(5.0, 0.3), createOrderBookBin(2.7, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.85), createOrderBookBin(8.3, 0.8)]
  },
  {
    "betting_market_id": "1.105.289",
    "aggregated_back_bets": [createOrderBookBin(4.21, 0.95), createOrderBookBin(2.4, 0.92)],
    "aggregated_lay_bets": [createOrderBookBin(8.7, 0.65), createOrderBookBin(3.6, 0.34)]
  },
  {
    "betting_market_id": "1.105.290",
    "aggregated_back_bets": [createOrderBookBin(9.5, 0.91), createOrderBookBin(4.7, 0.49)],
    "aggregated_lay_bets": [createOrderBookBin(7.59, 0.95), createOrderBookBin(4.59, 0.63)]
  },
  {
    "betting_market_id": "1.105.291",
    "aggregated_back_bets": [createOrderBookBin(6.24, 0.59), createOrderBookBin(5.6, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(5.5, 0.89), createOrderBookBin(4.5, 0.48)]
  },
  {
    "betting_market_id": "1.105.292",
    "aggregated_back_bets": [createOrderBookBin(5.7, 0.29), createOrderBookBin(3.5, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(3.2, 0.91), createOrderBookBin(2.5, 0.29)]
  },
  {
    "betting_market_id": "1.105.293",
    "aggregated_back_bets": [createOrderBookBin(9.77, 0.84), createOrderBookBin(5.52, 0.7)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.211), createOrderBookBin(2.4, 0.13)]
  },
  {
    "betting_market_id": "1.105.294",
    "aggregated_back_bets": [createOrderBookBin(9.52, 0.96), createOrderBookBin(3.5, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(7.3, 0.564), createOrderBookBin(5.88, 0.21)]
  },
  {
    "betting_market_id": "1.105.295",
    "aggregated_back_bets": [createOrderBookBin(7.68, 0.97), createOrderBookBin(4.8, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.88), createOrderBookBin(8.65, 0.69)]
  },
  {
    "betting_market_id": "1.105.296",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.89), createOrderBookBin(4.9, 0.7)],
    "aggregated_lay_bets": [createOrderBookBin(8.47, 0.77), createOrderBookBin(3.5, 0.34)]
  },
  {
    "betting_market_id": "1.105.297",
    "aggregated_back_bets": [createOrderBookBin(4.2, 0.34), createOrderBookBin(3.87, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(3.81, 0.89), createOrderBookBin(3.04, 0.47)]
  },
  {
    "betting_market_id": "1.105.298",
    "aggregated_back_bets": [createOrderBookBin(5.7, 0.88), createOrderBookBin(4.91, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(5.85, 0.91), createOrderBookBin(5.6, 0.52)]
  },
  {
    "betting_market_id": "1.105.299",
    "aggregated_back_bets": [createOrderBookBin(3.5, 0.68), createOrderBookBin(2.34, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(9.2, 0.59), createOrderBookBin(8.34, 0.21)]
  },
  {
    "betting_market_id": "1.105.300",
    "aggregated_back_bets": [createOrderBookBin(5.3, 0.87), createOrderBookBin(2.59, 0.84)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.72), createOrderBookBin(6.3, 0.49)]
  },
  {
    "betting_market_id": "1.105.301",
    "aggregated_back_bets": [createOrderBookBin(7.7, 0.89), createOrderBookBin(4.5, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(7.1, 0.89), createOrderBookBin(3.81, 0.59)]
  },
  {
    "betting_market_id": "1.105.302",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.33), createOrderBookBin(7.2, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(5.58, 0.72), createOrderBookBin(4.6, 0.28)]
  },
  {
    "betting_market_id": "1.105.303",
    "aggregated_back_bets": [createOrderBookBin(3.4, 0.85), createOrderBookBin(2.07, 0.48)],
    "aggregated_lay_bets": [createOrderBookBin(7.09, 0.87), createOrderBookBin(5.3, 0.49)]
  },
  {
    "betting_market_id": "1.105.304",
    "aggregated_back_bets": [createOrderBookBin(9.00, 0.449), createOrderBookBin(2.2, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(8.6, 0.46), createOrderBookBin(4.46, 0.29)]
  },
  {
    "betting_market_id": "1.105.305",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.974), createOrderBookBin(4.3, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(9.7, 0.29), createOrderBookBin(3.25, 0.07)]
  },
  {
    "betting_market_id": "1.105.306",
    "aggregated_back_bets": [createOrderBookBin(8.52, 0.48), createOrderBookBin(5.88, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(8.35, 0.29), createOrderBookBin(4.1, 0.237)]
  },
  {
    "betting_market_id": "1.105.307",
    "aggregated_back_bets": [createOrderBookBin(8.16, 0.72), createOrderBookBin(6.5, 0.72)],
    "aggregated_lay_bets": [createOrderBookBin(9.32, 0.81), createOrderBookBin(3.1, 0.16)]
  },
  {
    "betting_market_id": "1.105.308",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.31), createOrderBookBin(2.3, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(7.59, 0.59), createOrderBookBin(2.47, 0.1)]
  },
  {
    "betting_market_id": "1.105.309",
    "aggregated_back_bets": [createOrderBookBin(8.2, 0.295), createOrderBookBin(5.09, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(8.07, 0.8), createOrderBookBin(6.49, 0.211)]
  },
  {
    "betting_market_id": "1.105.310",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.8), createOrderBookBin(3.9, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(6.13, 0.72), createOrderBookBin(6.09, 0.237)]
  },
  {
    "betting_market_id": "1.105.311",
    "aggregated_back_bets": [createOrderBookBin(2.6, 0.39), createOrderBookBin(2.5, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(7.72, 0.84), createOrderBookBin(2.07, 0.09)]
  },
  {
    "betting_market_id": "1.105.312",
    "aggregated_back_bets": [createOrderBookBin(6.47, 0.69), createOrderBookBin(10.00, 0)],
    "aggregated_lay_bets": [createOrderBookBin(7.22, 0.95), createOrderBookBin(4.10, 0.77)]
  },
  //Soccer Event group 3
  {
    "betting_market_id": "1.105.313",
    "aggregated_back_bets": [createOrderBookBin(6.52, 0.73), createOrderBookBin(4.6, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(3.91, 0.72), createOrderBookBin(3.0, 0.65)]
  },
  {
    "betting_market_id": "1.105.314",
    "aggregated_back_bets": [createOrderBookBin(7.7, 0.85), createOrderBookBin(6.91, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(3.7, 0.77), createOrderBookBin(2.1, 0.58)]
  },
  {
    "betting_market_id": "1.105.315",
    "aggregated_back_bets": [createOrderBookBin(6.6, 0.974), createOrderBookBin(6.31, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(4.29, 0.55), createOrderBookBin(2.7, 0.31)]
  },
  {
    "betting_market_id": "1.105.316",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.85), createOrderBookBin(7.0, 0.73)],
    "aggregated_lay_bets": [createOrderBookBin(9.2, 0.85), createOrderBookBin(7.3, 0.77)]
  },
  {
    "betting_market_id": "1.105.317",
    "aggregated_back_bets": [createOrderBookBin(6.52, 0.95), createOrderBookBin(6.47, 0.84)],
    "aggregated_lay_bets": [createOrderBookBin(9.70, 0.34), createOrderBookBin(7.52, 0.25)]
  },
  {
    "betting_market_id": "1.105.318",
    "aggregated_back_bets": [createOrderBookBin(7.35, 0.666), createOrderBookBin(3.7, 0.32)],
    "aggregated_lay_bets": [createOrderBookBin(8.39, 0.57), createOrderBookBin(7.00, 0.33)]
  },
  {
    "betting_market_id": "1.105.319",
    "aggregated_back_bets": [createOrderBookBin(8.09, 0.57), createOrderBookBin(7.69, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(6.70, 0.21), createOrderBookBin(2.4, 0)]
  },
  {
    "betting_market_id": "1.105.320",
    "aggregated_back_bets": [createOrderBookBin(8.6, 0.52), createOrderBookBin(2.4, 0.449)],
    "aggregated_lay_bets": [createOrderBookBin(5.69, 0.449), createOrderBookBin(5.13, 0.29)]
  },
  {
    "betting_market_id": "1.105.321",
    "aggregated_back_bets": [createOrderBookBin(6.72, 0.63), createOrderBookBin(5.48, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(6.46, 0.25), createOrderBookBin(2.29, 0.21)]
  },
  {
    "betting_market_id": "1.105.322",
    "aggregated_back_bets": [createOrderBookBin(6.87, 0.295), createOrderBookBin(6.59, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(8.63, 0.85), createOrderBookBin(4.46, 0.295)]
  },
  {
    "betting_market_id": "1.105.323",
    "aggregated_back_bets": [createOrderBookBin(5.49, 0.35), createOrderBookBin(4.1, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.8), createOrderBookBin(9.72, 0.09)]
  },
  {
    "betting_market_id": "1.105.324",
    "aggregated_back_bets": [createOrderBookBin(8.5, 0.52), createOrderBookBin(2.69, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(7.6, 0.88), createOrderBookBin(5.92, 0.49)]
  },
  {
    "betting_market_id": "1.105.325",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.73), createOrderBookBin(3.63, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(7.13, 0.92), createOrderBookBin(2.1, 0.91)]
  },
  {
    "betting_market_id": "1.105.326",
    "aggregated_back_bets": [createOrderBookBin(3.85, 0.47), createOrderBookBin(3.80, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(7.8, 0.81), createOrderBookBin(3.9, 0.47)]
  },
  {
    "betting_market_id": "1.105.327",
    "aggregated_back_bets": [createOrderBookBin(8.9, 0.88), createOrderBookBin(3.3, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.21), createOrderBookBin(5.3, 0.003)]
  },
  {
    "betting_market_id": "1.105.328",
    "aggregated_back_bets": [createOrderBookBin(6.34, 0.59), createOrderBookBin(4.7, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(8.6, 0.72), createOrderBookBin(5.59, 0.59)]
  },
  {
    "betting_market_id": "1.105.329",
    "aggregated_back_bets": [createOrderBookBin(9.8, 0.52), createOrderBookBin(3.3, 0.48)],
    "aggregated_lay_bets": [createOrderBookBin(5.22, 0.88), createOrderBookBin(4.47, 0.553)]
  },
  {
    "betting_market_id": "1.105.330",
    "aggregated_back_bets": [createOrderBookBin(8.96, 0.8), createOrderBookBin(4.46, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(9.95, 0.8), createOrderBookBin(2.29, 0.21)]
  },
  {
    "betting_market_id": "1.105.331",
    "aggregated_back_bets": [createOrderBookBin(2.4, 0.55), createOrderBookBin(2.00, 0.237)],
    "aggregated_lay_bets": [createOrderBookBin(8.13, 0.07), createOrderBookBin(3.5, 0)]
  },
  {
    "betting_market_id": "1.105.332",
    "aggregated_back_bets": [createOrderBookBin(6.58, 0.65), createOrderBookBin(3.5, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(9.5, 0.553), createOrderBookBin(5.49, 0.21)]
  },
  {
    "betting_market_id": "1.105.333",
    "aggregated_back_bets": [createOrderBookBin(7.3, 0.89), createOrderBookBin(2.7, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(7.85, 0.57), createOrderBookBin(3.9, 0.29)]
  },
  {
    "betting_market_id": "1.105.334",
    "aggregated_back_bets": [createOrderBookBin(6.0, 0.59), createOrderBookBin(5.7, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(6.09, 0.39), createOrderBookBin(5.2, 0.34)]
  },
  {
    "betting_market_id": "1.105.335",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.34), createOrderBookBin(2.46, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(9.5, 0.8), createOrderBookBin(3.4, 0.52)]
  },
  {
    "betting_market_id": "1.105.336",
    "aggregated_back_bets": [createOrderBookBin(3.7, 0.92), createOrderBookBin(2.1, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(5.1, 0.11), createOrderBookBin(2.09, 0.003)]
  },
  {
    "betting_market_id": "1.105.337",
    "aggregated_back_bets": [createOrderBookBin(5.87, 0.81), createOrderBookBin(2.30, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(3.11, 0.55), createOrderBookBin(2.69, 0.07)]
  },
  {
    "betting_market_id": "1.105.338",
    "aggregated_back_bets": [createOrderBookBin(7.88, 0.974), createOrderBookBin(4.9, 0.8)],
    "aggregated_lay_bets": [createOrderBookBin(4.72, 0.29), createOrderBookBin(2.7, 0.21)]
  },
  {
    "betting_market_id": "1.105.339",
    "aggregated_back_bets": [createOrderBookBin(6.49, 0.36), createOrderBookBin(5.11, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(6.39, 0.46), createOrderBookBin(4.34, 0.13)]
  },
  {
    "betting_market_id": "1.105.340",
    "aggregated_back_bets": [createOrderBookBin(7.35, 0.71), createOrderBookBin(2.80, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(5.48, 0.974), createOrderBookBin(4.7, 0.46)]
  },
  {
    "betting_market_id": "1.105.341",
    "aggregated_back_bets": [createOrderBookBin(7.7, 0.8), createOrderBookBin(4.91, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(6.5, 0.95), createOrderBookBin(3.91, 0.82)]
  },
  {
    "betting_market_id": "1.105.342",
    "aggregated_back_bets": [createOrderBookBin(3.1, 0.46), createOrderBookBin(2.69, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(2.5, 0.46), createOrderBookBin(2.4, 0.13)]
  },
  //Baseball Event group 2
  {
    "betting_market_id": "1.105.343",
    "aggregated_back_bets": [createOrderBookBin(9.58, 0.769), createOrderBookBin(2.72, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(9.22, 0.52), createOrderBookBin(3.88, 0.04)]
  },
  {
    "betting_market_id": "1.105.344",
    "aggregated_back_bets": [createOrderBookBin(9.59, 0.59), createOrderBookBin(4.2, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.449), createOrderBookBin(7.2, 0.28)]
  },
  {
    "betting_market_id": "1.105.345",
    "aggregated_back_bets": [createOrderBookBin(8.30, 0.65), createOrderBookBin(7.80, 0.48)],
    "aggregated_lay_bets": [createOrderBookBin(6.3, 0.85), createOrderBookBin(5.63, 0.85)]
  },
  {
    "betting_market_id": "1.105.346",
    "aggregated_back_bets": [createOrderBookBin(7.13, 0.77), createOrderBookBin(4.9, 0.69)],
    "aggregated_lay_bets": [createOrderBookBin(5.5, 0.21), createOrderBookBin(3.59, 0.11)]
  },
  {
    "betting_market_id": "1.105.347",
    "aggregated_back_bets": [createOrderBookBin(7.1, 0.59), createOrderBookBin(2.4, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(9.9, 0.33), createOrderBookBin(2.47, 0.31)]
  },
  {
    "betting_market_id": "1.105.348",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.68), createOrderBookBin(8.9, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(6.7, 0.34), createOrderBookBin(3.11, 0.11)]
  },
  {
    "betting_market_id": "1.105.349",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.07), createOrderBookBin(2.8, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(8.4, 0.32), createOrderBookBin(2.91, 0.29)]
  },
  {
    "betting_market_id": "1.105.350",
    "aggregated_back_bets": [createOrderBookBin(6.9, 0.92), createOrderBookBin(5.2, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(5.57, 0.564), createOrderBookBin(5.30, 0.33)]
  },
  {
    "betting_market_id": "1.105.351",
    "aggregated_back_bets": [createOrderBookBin(8.32, 0.72), createOrderBookBin(6.9, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.237), createOrderBookBin(3.8, 0.09)]
  },
  {
    "betting_market_id": "1.105.352",
    "aggregated_back_bets": [createOrderBookBin(8.8, 0.99), createOrderBookBin(3.13, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(6.35, 0.49), createOrderBookBin(6.1, 0.39)]
  },
  {
    "betting_market_id": "1.105.353",
    "aggregated_back_bets": [createOrderBookBin(9.4, 0.52), createOrderBookBin(3.31, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(4.5, 0.46), createOrderBookBin(3.3, 0.101)]
  },
  {
    "betting_market_id": "1.105.354",
    "aggregated_back_bets": [createOrderBookBin(2.6, 0.91), createOrderBookBin(2.3, 0.85)],
    "aggregated_lay_bets": [createOrderBookBin(5.3, 1), createOrderBookBin(3.49, 0.74)]
  },
  {
    "betting_market_id": "1.105.355",
    "aggregated_back_bets": [createOrderBookBin(6.90, 0.89), createOrderBookBin(4.7, 0.74)],
    "aggregated_lay_bets": [createOrderBookBin(9.21, 0.449), createOrderBookBin(4.7, 0.13)]
  },
  {
    "betting_market_id": "1.105.356",
    "aggregated_back_bets": [createOrderBookBin(5.3, 0.99), createOrderBookBin(3.0, 0.586)],
    "aggregated_lay_bets": [createOrderBookBin(7.9, 0.74), createOrderBookBin(3.82, 0.72)]
  },
  {
    "betting_market_id": "1.105.357",
    "aggregated_back_bets": [createOrderBookBin(6.3, 0.91), createOrderBookBin(3.0, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(9.3, 0.666), createOrderBookBin(2.1, 0.46)]
  },
  {
    "betting_market_id": "1.105.358",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.87), createOrderBookBin(4.6, 0.65)],
    "aggregated_lay_bets": [createOrderBookBin(9.9, 0.59), createOrderBookBin(5.46, 0.241)]
  },
  {
    "betting_market_id": "1.105.359",
    "aggregated_back_bets": [createOrderBookBin(4.00, 1), createOrderBookBin(2.6, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(9.90, 0.82), createOrderBookBin(7.9, 0.35)]
  },
  {
    "betting_market_id": "1.105.360",
    "aggregated_back_bets": [createOrderBookBin(7.46, 0.39), createOrderBookBin(4.72, 0.36)],
    "aggregated_lay_bets": [createOrderBookBin(6.70, 0.564), createOrderBookBin(6.5, 0.49)]
  },
  {
    "betting_market_id": "1.105.361",
    "aggregated_back_bets": [createOrderBookBin(4.4, 0.84), createOrderBookBin(4.4, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(6.7, 1), createOrderBookBin(4.09, 0.72)]
  },
  {
    "betting_market_id": "1.105.362",
    "aggregated_back_bets": [createOrderBookBin(9.6, 0.63), createOrderBookBin(8.25, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(9.77, 0.8), createOrderBookBin(5.52, 0.59)]
  },
  {
    "betting_market_id": "1.105.363",
    "aggregated_back_bets": [createOrderBookBin(6.80, 0.13), createOrderBookBin(10.00, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(5.8, 0.7), createOrderBookBin(4.49, 0.329)]
  },
  {
    "betting_market_id": "1.105.364",
    "aggregated_back_bets": [createOrderBookBin(7.9, 0.74), createOrderBookBin(2.85, 0.36)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.8), createOrderBookBin(2.33, 0.09)]
  },
  {
    "betting_market_id": "1.105.365",
    "aggregated_back_bets": [createOrderBookBin(5.91, 0.49), createOrderBookBin(5.3, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(9.47, 0.81), createOrderBookBin(5.91, 0.057)]
  },
  {
    "betting_market_id": "1.105.366",
    "aggregated_back_bets": [createOrderBookBin(8.96, 0.59), createOrderBookBin(5.00, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(9.31, 0.73), createOrderBookBin(4.9, 0.68)]
  },
  {
    "betting_market_id": "1.105.367",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.47), createOrderBookBin(5.3, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(9.90, 0.16), createOrderBookBin(4.3, 0.09)]
  },
  {
    "betting_market_id": "1.105.368",
    "aggregated_back_bets": [createOrderBookBin(7.13, 0.58), createOrderBookBin(5.52, 0.39)],
    "aggregated_lay_bets": [createOrderBookBin(6.2, 0.3), createOrderBookBin(4.30, 0.11)]
  },
  {
    "betting_market_id": "1.105.369",
    "aggregated_back_bets": [createOrderBookBin(7.25, 0.237), createOrderBookBin(6.5, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(7.46, 0.46), createOrderBookBin(5.8, 0.449)]
  },
  {
    "betting_market_id": "1.105.370",
    "aggregated_back_bets": [createOrderBookBin(2.9, 0.666), createOrderBookBin(2.5, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(8.5, 0.96), createOrderBookBin(6.3, 0.07)]
  },
  {
    "betting_market_id": "1.105.371",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.92), createOrderBookBin(8.3, 0.49)],
    "aggregated_lay_bets": [createOrderBookBin(9.5, 0.96), createOrderBookBin(8.9, 0.85)]
  },
  {
    "betting_market_id": "1.105.372",
    "aggregated_back_bets": [createOrderBookBin(9.21, 0.87), createOrderBookBin(4.33, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(9.58, 0.96), createOrderBookBin(5.9, 0.81)]
  },
  //Baseball Event group 3
  {
    "betting_market_id": "1.105.373",
    "aggregated_back_bets": [createOrderBookBin(6.39, 0.35), createOrderBookBin(5.3, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(7.24, 1), createOrderBookBin(6.8, 0.11)]
  },
  {
    "betting_market_id": "1.105.374",
    "aggregated_back_bets": [createOrderBookBin(6.46, 0.92), createOrderBookBin(2.55, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(7.47, 0.77), createOrderBookBin(5.95, 0.057)]
  },
  {
    "betting_market_id": "1.105.375",
    "aggregated_back_bets": [createOrderBookBin(7.36, 0.48), createOrderBookBin(5.7, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(9.11, 0.25), createOrderBookBin(7.1, 0.057)]
  },
  {
    "betting_market_id": "1.105.376",
    "aggregated_back_bets": [createOrderBookBin(5.85, 0.72), createOrderBookBin(5.59, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(9.65, 0.59), createOrderBookBin(4.0, 0.47)]
  },
  {
    "betting_market_id": "1.105.377",
    "aggregated_back_bets": [createOrderBookBin(8.97, 0.58), createOrderBookBin(5.57, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(9.1, 0.92), createOrderBookBin(2.7, 0.36)]
  },
  {
    "betting_market_id": "1.105.378",
    "aggregated_back_bets": [createOrderBookBin(8.89, 0.8), createOrderBookBin(4.2, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(6.6, 0.69), createOrderBookBin(3.8, 0.211)]
  },
  {
    "betting_market_id": "1.105.379",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.88), createOrderBookBin(6.2, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(8.6, 0.52), createOrderBookBin(6.3, 0.35)]
  },
  {
    "betting_market_id": "1.105.380",
    "aggregated_back_bets": [createOrderBookBin(8.1, 0.88), createOrderBookBin(7.95, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(9.2, 0.63), createOrderBookBin(4.22, 0.52)]
  },
  {
    "betting_market_id": "1.105.381",
    "aggregated_back_bets": [createOrderBookBin(7.80, 0.96), createOrderBookBin(5.8, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(5.85, 0.69), createOrderBookBin(2.0, 0.29)]
  },
  {
    "betting_market_id": "1.105.382",
    "aggregated_back_bets": [createOrderBookBin(8.55, 0.55), createOrderBookBin(6.1, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(8.3, 0.59), createOrderBookBin(5.3, 0.29)]
  },
  {
    "betting_market_id": "1.105.383",
    "aggregated_back_bets": [createOrderBookBin(9.1, 0.96), createOrderBookBin(6.72, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(5.80, 0.52), createOrderBookBin(3.07, 0.23)]
  },
  {
    "betting_market_id": "1.105.384",
    "aggregated_back_bets": [createOrderBookBin(9.9, 0.95), createOrderBookBin(6.29, 0.68)],
    "aggregated_lay_bets": [createOrderBookBin(5.4, 0.92), createOrderBookBin(4.33, 0.34)]
  },
  {
    "betting_market_id": "1.105.385",
    "aggregated_back_bets": [createOrderBookBin(7.0, 0.48), createOrderBookBin(4.1, 0.241)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.72), createOrderBookBin(6.52, 0.33)]
  },
  {
    "betting_market_id": "1.105.386",
    "aggregated_back_bets": [createOrderBookBin(4.21, 0.91), createOrderBookBin(2.7, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(9.8, 0.586), createOrderBookBin(3.5, 0.47)]
  },
  {
    "betting_market_id": "1.105.387",
    "aggregated_back_bets": [createOrderBookBin(5.7, 0.85), createOrderBookBin(4.3, 0.26)],
    "aggregated_lay_bets": [createOrderBookBin(9.19, 0.8), createOrderBookBin(4.3, 0.07)]
  },
  {
    "betting_market_id": "1.105.388",
    "aggregated_back_bets": [createOrderBookBin(7.59, 0.8), createOrderBookBin(6.55, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(9.35, 0.71), createOrderBookBin(5.84, 0.101)]
  },
  {
    "betting_market_id": "1.105.389",
    "aggregated_back_bets": [createOrderBookBin(9.91, 0.95), createOrderBookBin(9.87, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(6.59, 0.71), createOrderBookBin(4.1, 0.69)]
  },
  {
    "betting_market_id": "1.105.390",
    "aggregated_back_bets": [createOrderBookBin(8.3, 0.39), createOrderBookBin(7.8, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(9.34, 0.81), createOrderBookBin(2.34, 0.449)]
  },
  {
    "betting_market_id": "1.105.391",
    "aggregated_back_bets": [createOrderBookBin(8.7, 0.91), createOrderBookBin(8.46, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(5.89, 0.28), createOrderBookBin(5.3, 0.16)]
  },
  {
    "betting_market_id": "1.105.392",
    "aggregated_back_bets": [createOrderBookBin(6.39, 0.39), createOrderBookBin(3.0, 0.04)],
    "aggregated_lay_bets": [createOrderBookBin(8.89, 0.77), createOrderBookBin(6.26, 0.34)]
  },
  {
    "betting_market_id": "1.105.393",
    "aggregated_back_bets": [createOrderBookBin(7.36, 0.39), createOrderBookBin(4.39, 0.19)],
    "aggregated_lay_bets": [createOrderBookBin(5.7, 0.24), createOrderBookBin(5.3, 0.1)]
  },
  {
    "betting_market_id": "1.105.394",
    "aggregated_back_bets": [createOrderBookBin(6.7, 0.8), createOrderBookBin(4.5, 0.74)],
    "aggregated_lay_bets": [createOrderBookBin(8.73, 0.82), createOrderBookBin(5.5, 0.73)]
  },
  {
    "betting_market_id": "1.105.395",
    "aggregated_back_bets": [createOrderBookBin(7.0, 0.69), createOrderBookBin(4.9, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(6.8, 0.36), createOrderBookBin(2.59, 0.13)]
  },
  {
    "betting_market_id": "1.105.396",
    "aggregated_back_bets": [createOrderBookBin(9.63, 0.7), createOrderBookBin(10.0, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(5.3, 0.89), createOrderBookBin(5.0, 0.25)]
  },
  {
    "betting_market_id": "1.105.397",
    "aggregated_back_bets": [createOrderBookBin(7.32, 0.81), createOrderBookBin(5.11, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(3.81, 0.35), createOrderBookBin(3.7, 0.11)]
  },
  {
    "betting_market_id": "1.105.398",
    "aggregated_back_bets": [createOrderBookBin(6.00, 0.97), createOrderBookBin(3.5, 0.55)],
    "aggregated_lay_bets": [createOrderBookBin(8.35, 0.69), createOrderBookBin(6.2, 0.58)]
  },
  {
    "betting_market_id": "1.105.399",
    "aggregated_back_bets": [createOrderBookBin(6.48, 0.39), createOrderBookBin(3.13, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(5.0, 0.81), createOrderBookBin(2.55, 0.28)]
  },
  {
    "betting_market_id": "1.105.400",
    "aggregated_back_bets": [createOrderBookBin(4.77, 0.81), createOrderBookBin(2.85, 0.769)],
    "aggregated_lay_bets": [createOrderBookBin(7.4, 1), createOrderBookBin(4.69, 0.91)]
  },
  {
    "betting_market_id": "1.105.401",
    "aggregated_back_bets": [createOrderBookBin(4.21, 0.89), createOrderBookBin(3.4, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(3.2, 0.59), createOrderBookBin(2.11, 0.39)]
  },
  {
    "betting_market_id": "1.105.402",
    "aggregated_back_bets": [createOrderBookBin(7.6, 0.74), createOrderBookBin(5.99, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(3.7, 0.769), createOrderBookBin(3.24, 0.329)]
  },
  //For Resolved Bets
  //American Football
  {
    "betting_market_id": "1.105.403",
    "aggregated_back_bets": [createOrderBookBin(5.8, 0.31), createOrderBookBin(4.34, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(6.9, 0.73), createOrderBookBin(6.7, 0.46)]
  },
  {
    "betting_market_id": "1.105.404",
    "aggregated_back_bets": [createOrderBookBin(8.6, 0.449), createOrderBookBin(2.52, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(8.2, 0.34), createOrderBookBin(5.1, 0.04)]
  },
  {
    "betting_market_id": "1.105.405",
    "aggregated_back_bets": [createOrderBookBin(3.9, 0.82), createOrderBookBin(3.65, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.26), createOrderBookBin(2.2, 0.04)]
  },
  {
    "betting_market_id": "1.105.406",
    "aggregated_back_bets": [createOrderBookBin(6.5, 0.65), createOrderBookBin(6.2, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(6.95, 0.769), createOrderBookBin(4.8, 0.69)]
  },
  {
    "betting_market_id": "1.105.407",
    "aggregated_back_bets": [createOrderBookBin(8.13, 0.21), createOrderBookBin(3.80, 0.003)],
    "aggregated_lay_bets": [createOrderBookBin(8.1, 0.59), createOrderBookBin(3.34, 0.07)]
  },
  {
    "betting_market_id": "1.105.408",
    "aggregated_back_bets": [createOrderBookBin(8.69, 0.33), createOrderBookBin(7.3, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(8.46, 0.69), createOrderBookBin(5.3, 0.49)]
  },
  {
    "betting_market_id": "1.105.409",
    "aggregated_back_bets": [createOrderBookBin(7.29, 0.49), createOrderBookBin(6.82, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(8.25, 0.85), createOrderBookBin(3.3, 0)]
  },
  {
    "betting_market_id": "1.105.410",
    "aggregated_back_bets": [createOrderBookBin(7.5, 0.29), createOrderBookBin(2.24, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(5.72, 0.91), createOrderBookBin(3.21, 0.69)]
  },
  {
    "betting_market_id": "1.105.411",
    "aggregated_back_bets": [createOrderBookBin(7.8, 0.99), createOrderBookBin(2.8, 0.91)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.91), createOrderBookBin(8.3, 0.9)]
  },
  {
    "betting_market_id": "1.105.412",
    "aggregated_back_bets": [createOrderBookBin(5.3, 0.96), createOrderBookBin(2.4, 0.29)],
    "aggregated_lay_bets": [createOrderBookBin(9.46, 0.9), createOrderBookBin(6.6, 0.16)]
  },
  {
    "betting_market_id": "1.105.413",
    "aggregated_back_bets": [createOrderBookBin(6.3, 0.8), createOrderBookBin(5.35, 0.58)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.3), createOrderBookBin(2.58, 0.13)]
  },
  {
    "betting_market_id": "1.105.414",
    "aggregated_back_bets": [createOrderBookBin(9.55, 0.82), createOrderBookBin(7.49, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(6.26, 0.19), createOrderBookBin(5.36, 0.13)]
  },
  {
    "betting_market_id": "1.105.415",
    "aggregated_back_bets": [createOrderBookBin(9.63, 0.85), createOrderBookBin(7.8, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(6.07, 0.88), createOrderBookBin(4.3, 0.49)]
  },
  {
    "betting_market_id": "1.105.416",
    "aggregated_back_bets": [createOrderBookBin(7.0, 1), createOrderBookBin(6.9, 0.91)],
    "aggregated_lay_bets": [createOrderBookBin(9.46, 0.39), createOrderBookBin(2.57, 0.329)]
  },
  {
    "betting_market_id": "1.105.417",
    "aggregated_back_bets": [createOrderBookBin(6.92, 0.553), createOrderBookBin(5.70, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(7.07, 0.95), createOrderBookBin(6.81, 0.09)]
  },
  {
    "betting_market_id": "1.105.418",
    "aggregated_back_bets": [createOrderBookBin(7.71, 0.88), createOrderBookBin(3.5, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(4.31, 0.91), createOrderBookBin(3.82, 0.586)]
  },
  {
    "betting_market_id": "1.105.419",
    "aggregated_back_bets": [createOrderBookBin(6.84, 0.72), createOrderBookBin(6.80, 0.63)],
    "aggregated_lay_bets": [createOrderBookBin(7.28, 0.91), createOrderBookBin(4.7, 0.26)]
  },
  {
    "betting_market_id": "1.105.420",
    "aggregated_back_bets": [createOrderBookBin(9.34, 0.52), createOrderBookBin(5.8, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(4.3, 0.35), createOrderBookBin(2.33, 0.13)]
  },
  {
    "betting_market_id": "1.105.421",
    "aggregated_back_bets": [createOrderBookBin(3.87, 0.95), createOrderBookBin(10.0, 0.88)],
    "aggregated_lay_bets": [createOrderBookBin(9.80, 0.8), createOrderBookBin(2.9, 0.586)]
  },
  {
    "betting_market_id": "1.105.422",
    "aggregated_back_bets": [createOrderBookBin(7.81, 0.46), createOrderBookBin(4.3, 0.11)],
    "aggregated_lay_bets": [createOrderBookBin(3.91, 0.91), createOrderBookBin(3.73, 0.29)]
  },
  {
    "betting_market_id": "1.105.423",
    "aggregated_back_bets": [createOrderBookBin(9.1, 0.553), createOrderBookBin(5.82, 0.237)],
    "aggregated_lay_bets": [createOrderBookBin(5.5, 0.8), createOrderBookBin(2.4, 0.13)]
  },
  {
    "betting_market_id": "1.105.424",
    "aggregated_back_bets": [createOrderBookBin(9.07, 0.39), createOrderBookBin(4.4, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(9.4, 0.666), createOrderBookBin(8.25, 0.16)]
  },
  {
    "betting_market_id": "1.105.425",
    "aggregated_back_bets": [createOrderBookBin(6.97, 0.36), createOrderBookBin(5.21, 0.35)],
    "aggregated_lay_bets": [createOrderBookBin(8.25, 0.59), createOrderBookBin(6.46, 0.057)]
  },
  {
    "betting_market_id": "1.105.426",
    "aggregated_back_bets": [createOrderBookBin(6.2, 0.666), createOrderBookBin(2.73, 0.46)],
    "aggregated_lay_bets": [createOrderBookBin(9.16, 0.34), createOrderBookBin(7.09, 0.09)]
  },
  {
    "betting_market_id": "1.105.427",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.52), createOrderBookBin(3.95, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(9.16, 0.71), createOrderBookBin(2.5, 0.55)]
  },
  {
    "betting_market_id": "1.105.428",
    "aggregated_back_bets": [createOrderBookBin(8.55, 0.8), createOrderBookBin(2.46, 0)],
    "aggregated_lay_bets": [createOrderBookBin(6.59, 0.95), createOrderBookBin(5.3, 0.003)]
  },
  {
    "betting_market_id": "1.105.429",
    "aggregated_back_bets": [createOrderBookBin(8.04, 0.81), createOrderBookBin(7.21, 0.47)],
    "aggregated_lay_bets": [createOrderBookBin(9.6, 0.59), createOrderBookBin(2.95, 0.07)]
  },
  {
    "betting_market_id": "1.105.430",
    "aggregated_back_bets": [createOrderBookBin(7.52, 0.96), createOrderBookBin(4.04, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(7.8, 0.47), createOrderBookBin(7.49, 0.16)]
  },
  {
    "betting_market_id": "1.105.431",
    "aggregated_back_bets": [createOrderBookBin(9.7, 0.77), createOrderBookBin(5.26, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(7.80, 0.24), createOrderBookBin(6.5, 0.11)]
  },
  {
    "betting_market_id": "1.105.432",
    "aggregated_back_bets": [createOrderBookBin(6.1, 0.85), createOrderBookBin(5.8, 0.24)],
    "aggregated_lay_bets": [createOrderBookBin(8.80, 0.564), createOrderBookBin(2.81, 0.26)]
  },
  //Basketball
  {
    "betting_market_id": "1.105.433",
    "aggregated_back_bets": [createOrderBookBin(3.5, 0.82), createOrderBookBin(3.3, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(9.23, 0.95), createOrderBookBin(2.6, 0.16)]
  },
  {
    "betting_market_id": "1.105.434",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.92), createOrderBookBin(2.34, 0.25)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.3), createOrderBookBin(2.5, 0.13)]
  },
  {
    "betting_market_id": "1.105.435",
    "aggregated_back_bets": [createOrderBookBin(7.69, 0.295), createOrderBookBin(4.84, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(7.8, 0.91), createOrderBookBin(7.69, 0.241)]
  },
  {
    "betting_market_id": "1.105.436",
    "aggregated_back_bets": [createOrderBookBin(7.72, 1), createOrderBookBin(2.5, 0.07)],
    "aggregated_lay_bets": [createOrderBookBin(9.58, 0.85), createOrderBookBin(3.59, 0.25)]
  },
  {
    "betting_market_id": "1.105.437",
    "aggregated_back_bets": [createOrderBookBin(7.84, 0.85), createOrderBookBin(5.22, 0.31)],
    "aggregated_lay_bets": [createOrderBookBin(8.5, 0.63), createOrderBookBin(8.2, 0.09)]
  },
  {
    "betting_market_id": "1.105.438",
    "aggregated_back_bets": [createOrderBookBin(6.99, 0.59), createOrderBookBin(6.3, 0.33)],
    "aggregated_lay_bets": [createOrderBookBin(8.8, 0.48), createOrderBookBin(4.72, 0.21)]
  },
  {
    "betting_market_id": "1.105.439",
    "aggregated_back_bets": [createOrderBookBin(5.7, 0.59), createOrderBookBin(5.3, 0.52)],
    "aggregated_lay_bets": [createOrderBookBin(5.21, 0.88), createOrderBookBin(3.2, 0.22)]
  },
  {
    "betting_market_id": "1.105.440",
    "aggregated_back_bets": [createOrderBookBin(4.9, 0.92), createOrderBookBin(4.2, 0.16)],
    "aggregated_lay_bets": [createOrderBookBin(4.4, 0.72), createOrderBookBin(2.69, 0.666)]
  },
  {
    "betting_market_id": "1.105.441",
    "aggregated_back_bets": [createOrderBookBin(8.13, 0.81), createOrderBookBin(6.1, 0.09)],
    "aggregated_lay_bets": [createOrderBookBin(8.7, 0.85), createOrderBookBin(6.70, 0.3)]
  },
  {
    "betting_market_id": "1.105.442",
    "aggregated_back_bets": [createOrderBookBin(5.9, 0.49), createOrderBookBin(2.9, 0.057)],
    "aggregated_lay_bets": [createOrderBookBin(7.33, 0.92), createOrderBookBin(3.7, 0)]
  },
  {
    "betting_market_id": "1.105.443",
    "aggregated_back_bets": [createOrderBookBin(8.9, 0.55), createOrderBookBin(5.72, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(4.1, 0.32), createOrderBookBin(3.7, 0.101)]
  },
  {
    "betting_market_id": "1.105.444",
    "aggregated_back_bets": [createOrderBookBin(6.35, 0.71), createOrderBookBin(6.0, 0.101)],
    "aggregated_lay_bets": [createOrderBookBin(8.82, 0.46), createOrderBookBin(6.89, 0.11)]
  },
  //Baseball
  {
    "betting_market_id": "1.105.445",
    "aggregated_back_bets": [createOrderBookBin(9.0, 0.85), createOrderBookBin(5.5, 0.34)],
    "aggregated_lay_bets": [createOrderBookBin(7.33, 0.82), createOrderBookBin(5.6, 0.666)]
  },
  {
    "betting_market_id": "1.105.446",
    "aggregated_back_bets": [createOrderBookBin(4.91, 0.8), createOrderBookBin(2.5, 0.73)],
    "aggregated_lay_bets": [createOrderBookBin(9.33, 0.82), createOrderBookBin(3.72, 0.72)]
  },
  {
    "betting_market_id": "1.105.447",
    "aggregated_back_bets": [createOrderBookBin(5.2, 0.85), createOrderBookBin(2.07, 0.3)],
    "aggregated_lay_bets": [createOrderBookBin(5.21, 0.47), createOrderBookBin(4.49, 0.16)]
  },
  {
    "betting_market_id": "1.105.448",
    "aggregated_back_bets": [createOrderBookBin(9.1, 0.71), createOrderBookBin(6.0, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(6.09, 0.58), createOrderBookBin(2.92, 0.329)]
  },
  {
    "betting_market_id": "1.105.449",
    "aggregated_back_bets": [createOrderBookBin(7.46, 0.35), createOrderBookBin(3.73, 0.13)],
    "aggregated_lay_bets": [createOrderBookBin(3.68, 0.58), createOrderBookBin(3.36, 0.46)]
  },
  {
    "betting_market_id": "1.105.450",
    "aggregated_back_bets": [createOrderBookBin(9.77, 0.89), createOrderBookBin(7.11, 0.82)],
    "aggregated_lay_bets": [createOrderBookBin(7.2, 0.85), createOrderBookBin(4.90, 0.33)]
  },
  {
    "betting_market_id": "1.105.451",
    "aggregated_back_bets": [createOrderBookBin(9.58, 0.99), createOrderBookBin(8.72, 0.21)],
    "aggregated_lay_bets": [createOrderBookBin(7.9, 0.85), createOrderBookBin(2.5, 0.85)]
  },
  {
    "betting_market_id": "1.105.452",
    "aggregated_back_bets": [createOrderBookBin(8.39, 0.97), createOrderBookBin(7.16, 0.57)],
    "aggregated_lay_bets": [createOrderBookBin(6.46, 0.97), createOrderBookBin(2.09, 0.46)]
  },
  {
    "betting_market_id": "1.105.453",
    "aggregated_back_bets": [createOrderBookBin(2.84, 0.97), createOrderBookBin(2.4, 0.89)],
    "aggregated_lay_bets": [createOrderBookBin(7.0, 0.34), createOrderBookBin(4.2, 0.31)]
  },
  {
    "betting_market_id": "1.105.454",
    "aggregated_back_bets": [createOrderBookBin(8.68, 0.82), createOrderBookBin(6.96, 0.59)],
    "aggregated_lay_bets": [createOrderBookBin(7.5, 0.77), createOrderBookBin(3.1, 0.68)]
  },
  {
    "betting_market_id": "1.105.455",
    "aggregated_back_bets": [createOrderBookBin(9.3, 0.52), createOrderBookBin(7.8, 0.22)],
    "aggregated_lay_bets": [createOrderBookBin(8.9, 0.57), createOrderBookBin(7.88, 0.26)]
  },
  {
    "betting_market_id": "1.105.456",
    "aggregated_back_bets": [createOrderBookBin(8.72, 0.59), createOrderBookBin(8.21, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(9.6, 0.29), createOrderBookBin(5.2, 0)]
  },
  {
    "betting_market_id": "1.105.457",
    "aggregated_back_bets": [createOrderBookBin(3.32, 0.59), createOrderBookBin(5.21, 0.28)],
    "aggregated_lay_bets": [createOrderBookBin(2.6, 0.29), createOrderBookBin(4.2, 0)]
  }
  //Resolved Bets Ends
];

//TODO: add more in this list, pay attention on the relation with the betting_markets dummy data
//TODO: for each event, make one moneyline, spread, overunder

export default binnedOrderBooks;
