import Immutable from 'immutable';
import {ActionTypes} from '../constants/ActionTypes';

/**
 * Reducer is used to controlling exchange page
 * Initial page
 *
 * @type {{baseAssetId: null, quoteAssetId: null, coreAsset: null, baseAsset: null, quoteAsset: null, coreAssetBalance: null, baseAssetBalance: null, quoteAssetBalance: null, coreAssetSymbol: null, baseAssetSymbol: null, quoteAssetSymbol: null, quoteAssetPrecision: number, baseAssetPrecision: number, baseAssetName: null, quoteAssetName: null, latestPrice: number, latestPriceText: number, latestPriceChangeType: string, lowBase: number, highBase: number, change: number, volumeBase: number, volumeQuote: number, currentTab: number, tabs: Array, marketRowsData: Array, marketHistory: (Immutable.OrderedSet<T>|Immutable.OrderedSet<any>|*), marketRowsDataSortBy: string, marketRowsDataSortInvert: boolean, marketRowsDataLoaderIsShow: boolean, highPriceList: Array, priceData: Array, priceChartCurrentPeriod: null, currentBucket: number, buckets: [*], priceChartStatusLoader: string, bids: Array, asks: Array, settlementPrice: number, power: number, totalAsks: number, totalBids: number, openOrders: Array, bidsOrders: Array, asksOrders: Array}}
 */
let defaultState = {

  baseAssetId: null,
  quoteAssetId: null,
  coreAsset: null,
  baseAsset: null,
  quoteAsset: null,
  coreAssetBalance: null,
  baseAssetBalance: null,
  quoteAssetBalance: null,
  coreAssetSymbol: null,
  baseAssetSymbol: null,
  quoteAssetSymbol: null,
  quoteAssetPrecision: 0,
  baseAssetPrecision: 0,
  baseAssetName: null,
  quoteAssetName: null,
  latestPrice: 0,
  latestPriceText: 0,
  latestPriceChangeType: '',
  lowBase: 0,
  highBase: 0,
  change: 0,
  volumeBase: 0,
  volumeQuote: 0,

  /**
   * Markets
   */
  currentTab: 0,
  tabs: [],
  marketRowsData: [],
  marketHistory: Immutable.OrderedSet(),
  marketRowsDataSortBy: 'volume',
  marketRowsDataSortInvert: true,
  marketRowsDataLoaderIsShow: true,
  /**
   * Price Chart
   */
  highPriceList: [],
  priceData: [],
  priceChartCurrentPeriod: null,
  currentBucket: 86400,
  buckets: [300, 3600, 86400],
  priceChartStatusLoader: 'default',
  /**
   * Depth Chart
   */
  bids: [],
  asks: [],
  settlementPrice: 0,
  power: 1,
  totalAsks: 0,
  totalBids: 0,
  openOrders: [],
  bidsOrders: [],
  asksOrders: []
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.EXCHANGE_SET_DATA:
      return Object.assign({}, state, {
        latestPrice: action.payload.latestPrice,
        latestPriceText: action.payload.latestPriceText,
        latestPriceChangeType: action.payload.latestPriceChangeType,
        lowBase: action.payload.lowBase,
        highBase: action.payload.highBase,
        change: action.payload.change,
        volumeBase: action.payload.volumeBase,
        volumeQuote: action.payload.volumeQuote,
        marketHistory: action.payload.marketHistory
      });
    case ActionTypes.EXCHANGE_SET_MARKETS_DATA:
      return Object.assign({}, state, {
        tabs: action.payload.tabs
      });
    case ActionTypes.EXCHANGE_SET_MARKETS_TAB:
      return Object.assign({}, state, {
        currentTab: action.payload.currentTab,
        marketRowsDataLoaderIsShow: action.payload.marketRowsDataLoaderIsShow
      });
    case ActionTypes.EXCHANGE_SET_MARKETS_ROWS:
      return Object.assign({}, state, {
        marketRowsData: action.payload.marketRowsData,
        marketRowsDataLoaderIsShow: action.payload.marketRowsDataLoaderIsShow
      });
    case ActionTypes.EXCHANGE_SET_MARKETS_ROWS_SORT:
      return Object.assign({}, state, {
        marketRowsDataSortBy: action.payload.marketRowsDataSortBy,
        marketRowsDataSortInvert: action.payload.marketRowsDataSortInvert
      });
    case ActionTypes.EXCHANGE_SET_MARKETS_ROWS_LOADER:
      return Object.assign({}, state, {
        marketRowsDataLoaderIsShow: action.payload.marketRowsDataLoaderIsShow
      });
    case ActionTypes.EXCHANGE_SET_PRICE_CHART_DATA:
      return Object.assign({}, state, {
        highPriceList: action.payload.highPriceList,
        priceData: action.payload.priceData
      });
    case ActionTypes.EXCHANGE_SET_PRICE_CHART_PERIOD:
      return Object.assign({}, state, {
        priceChartCurrentPeriod: action.payload.priceChartCurrentPeriod
      });
    case ActionTypes.EXCHANGE_SET_CURRENT_ASSETS_DATA:
      return Object.assign({}, state, {
        baseAssetId: action.payload.baseAssetId,
        quoteAssetId: action.payload.quoteAssetId,
        coreAsset: action.payload.coreAsset,
        baseAsset: action.payload.baseAsset,
        quoteAsset: action.payload.quoteAsset,
        coreAssetSymbol: action.payload.coreAssetSymbol,
        baseAssetSymbol: action.payload.baseAssetSymbol,
        quoteAssetSymbol: action.payload.quoteAssetSymbol,
        baseAssetPrecision: action.payload.baseAssetPrecision,
        quoteAssetPrecision: action.payload.quoteAssetPrecision,
        baseAssetName: action.payload.baseAssetName,
        quoteAssetName: action.payload.quoteAssetName
      });
    case ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_BUCKET:
      return Object.assign({}, state, {
        highPriceList: action.payload.highPriceList,
        priceData: action.payload.priceData,
        currentBucket: action.payload.currentBucket
      });
    case ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_BUCKETS:
      return Object.assign({}, state, {
        buckets: action.payload.buckets
      });
    case ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_LOADER:
      return Object.assign({}, state, {
        priceChartStatusLoader: action.payload.priceChartStatusLoader
      });
    case ActionTypes.EXCHANGE_SET_DEPTH_CHART_DATA:
      return Object.assign({}, state, {
        bids: action.payload.bids,
        asks: action.payload.asks,
        settlementPrice: action.payload.settlementPrice,
        power: action.payload.power,
        totalAsks: action.payload.totalAsks,
        totalBids: action.payload.totalBids,
        openOrders: action.payload.openOrders,
        bidsOrders: action.payload.bidsOrders,
        asksOrders: action.payload.asksOrders
      });
    case ActionTypes.EXCHANGE_SET_BALANCES:
      return Object.assign({}, state, {
        coreAssetBalance: action.payload.coreAssetBalance,
        baseAssetBalance: action.payload.baseAssetBalance,
        quoteAssetBalance: action.payload.quoteAssetBalance
      });
    default:
      return state;
  }
}