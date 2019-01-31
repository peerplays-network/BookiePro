import ActionTypes from '../constants/ActionTypes';
import MarketRepository from '../repositories/MarketRepository';
import AssetRepository from '../repositories/AssetRepository';
import ExchangeService from '../services/ExchangeService';//TODO::rm
import AssetNameHelper from '../helpers/AssetNameHelper';
import Repository from 'repositories/chain/repository';
import {EmitterInstance} from 'peerplaysjs-lib';
import ls from 'common/localStorage';

let emitter = EmitterInstance.emitter();
let storage = new ls('__peerplays__'); // eslint-disable-line
let marketStatsTimeout = null;
let assetsCacheBySymbol = {};
let assetsCacheById = {};
let subscribers = {};
let currentDeleting = {};
let stack = [];

class ExchangePagePrivateActions {
  /**
   * Private Redux Action Creator (EXCHANGE_SET_DATA)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangeDataAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_DATA,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_MARKETS_DATA)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangeMarketsAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_MARKETS_DATA,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_MARKETS_TAB)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangeMarketsTabAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_MARKETS_TAB,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_MARKETS_ROWS)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangeMarketsRowsAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_MARKETS_ROWS,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_MARKETS_ROWS_SORT)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangeMarketsRowsSortAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_MARKETS_ROWS_SORT,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_PRICE_CHART_DATA)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangePriceChartAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_PRICE_CHART_DATA,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_PRICE_CHART_PERIOD)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeExchangePriceChartPeriodAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_PRICE_CHART_PERIOD,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_CURRENT_ASSETS_DATA)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changeCurrentAssetsDataAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_CURRENT_ASSETS_DATA,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_BUCKET)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changePriceChartBucketAction(data) {
    return {
      type: ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_BUCKET,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_BUCKETS)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changePriceChartBucketsAction(data) {
    return {
      type: ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_BUCKETS,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_LOADER)
   * @param data
   * @returns {{type, payload: *}}
   */
  static changePriceChartLoaderAction(data) {
    return {
      type: ActionTypes.EXCHANGE_CHANGE_PRICE_CHART_LOADER,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_DEPTH_CHART_DATA)
   * @param data
   * @returns {{type, payload: *}}
   */
  static setDepthChartDataAction(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_DEPTH_CHART_DATA,
      payload: data
    };
  }

  /**
   * Private Redux Action Creator (EXCHANGE_SET_BALANCES)
   * @param data
   * @returns {{type, payload: *}}
   */
  static setExchangeBalances(data) {
    return {
      type: ActionTypes.EXCHANGE_SET_BALANCES,
      payload: data
    };
  }
}

class ExchangePageActions {
  /**
 * Subscribe to market
 *
 * @param baseAssetSymbol
 * @param quoteAssetSymbol
 * @returns {function(*)}
 */
  static subscribeMarket(baseAssetSymbol, quoteAssetSymbol) {
    return (dispatch) => {
      // TODO; import core_asset
      let coreAssetSymbol = CORE_ASSET; // eslint-disable-line
      Promise.all([Repository.getAsset(quoteAssetSymbol),
        Repository.getAsset(baseAssetSymbol),
        Repository.getAsset(coreAssetSymbol)]).then(([quoteAsset, baseAsset, coreAsset]) => {
        quoteAsset = quoteAsset.toJS();
        baseAsset = baseAsset.toJS();
        coreAsset = coreAsset.toJS();
        let baseAssetName,
          quoteAssetName;

        if (!quoteAsset || !baseAsset) {
          //TODO:: show error for user
          return false;
        }

        baseAssetName = AssetNameHelper.getAssetName(baseAsset);
        quoteAssetName = AssetNameHelper.getAssetName(quoteAsset);
        dispatch(ExchangePagePrivateActions.changeCurrentAssetsDataAction({
          baseAssetId:baseAsset.id,
          quoteAssetId:quoteAsset.id,
          coreAsset:coreAsset,
          baseAsset:baseAsset,
          quoteAsset:quoteAsset,
          coreAssetSymbol: coreAssetSymbol,
          baseAssetSymbol: baseAsset.symbol,
          quoteAssetSymbol: quoteAsset.symbol,
          baseAssetPrecision: baseAsset.precision,
          quoteAssetPrecision: quoteAsset.precision,
          baseAssetName: baseAssetName,
          quoteAssetName: quoteAssetName
        }));
        dispatch(ExchangePageActions.updateData());
        stack.push({
          type: 'subscribe',
          quoteAssetId: quoteAsset.id,
          baseAssetId: baseAsset.id
        });
        dispatch(ExchangePageActions.processStack());
      });
    };
  }

  /**
 * Unsubscribe Market
 * @returns {function(*=)}
 */
  static unSubscribeMarket() {
    return (dispatch) => {
      let subKeys = Object.keys(subscribers);

      if (subKeys.length) {
        subKeys.forEach((subKey) => {
          if (currentDeleting[subKey]) {
            return null;
          }

          currentDeleting[subKey] = true;
          let sub = subscribers[subKey];
          emitter.off('cancel-order', sub['subscribeFunction']);
          MarketRepository.unSubscribeFromMarket(
            sub.quoteAssetId,
            sub.baseAssetId,
            sub.subscribeFunction
          ).then(() => {
            console.warn('[APP] UNSUBSCRIBE', subKey);
            delete subscribers[subKey];
            delete currentDeleting[subKey];
            dispatch(ExchangePageActions.processStack());
          });
        });
      }
    };
  }

  /**
 * Subscribes Stack
 *
 * @returns {function(*)}
 */
  static processStack() {
    return (dispatch) => {
      if (!stack.length) {
        return null;
      }

      let subKeys = Object.keys(subscribers);

      if (subKeys.length) {
        dispatch(ExchangePageActions.unSubscribeMarket());
      } else {
        let subscribeObject = stack.shift();
        let subId = subscribeObject.quoteAssetId + '_' + subscribeObject.baseAssetId;

        let subscribeFunction = () => {
          console.warn('[APP] MARKET UPDATER', subId);
          dispatch(ExchangePageActions.updateData());
        };

        subscribers[subId] = {
          subscribeFunction: subscribeFunction,
          quoteAssetId: subscribeObject.quoteAssetId,
          baseAssetId: subscribeObject.baseAssetId
        };
        MarketRepository.subscribeToMarket(
          subscribeObject.quoteAssetId,
          subscribeObject.baseAssetId,
          subscribeFunction
        ).then(() => {
          emitter.on('cancel-order', subscribeFunction);
          console.warn('[APP] SUBSCRIBE', subId);
          dispatch(ExchangePageActions.processStack());
        });
      }
    };
  }

  /**
 * Update page data
 *
 * @returns {function(*, *)}
 */
  static updateData(){
    return (dispatch, getState)=>{
      let selfState = getState().exchangePageReducer;
      let baseAssetSymbol = selfState.baseAssetSymbol;
      let quoteAssetSymbol = selfState.quoteAssetSymbol;

      // Fetch depth chart data
      ExchangeService.fetchChartDepthData(quoteAssetSymbol, baseAssetSymbol)
        .then((chartDepthData) => {
          dispatch(ExchangePagePrivateActions.setDepthChartDataAction(chartDepthData));
        });

      // Fetch price chart data
      ExchangeService.fetchChartData(quoteAssetSymbol, baseAssetSymbol, selfState.currentBucket)
        .then((data) => {
          dispatch(ExchangePagePrivateActions.changePriceChartBucketsAction({
            buckets: data.buckets
          }));

          dispatch(ExchangePagePrivateActions.changeExchangePriceChartAction({
            highPriceList: data.priceData.highPriceList,
            priceData: data.priceData.priceData
          }));
        });

      // Fetch exchange data
      ExchangeService.fetchExchangeData(quoteAssetSymbol, baseAssetSymbol).then((data) => {
        dispatch(ExchangePagePrivateActions.changeExchangeDataAction(data));
      });
    };
  }

  static initStarredMarkets() {
    return (dispatch, getState) => {
      let state = getState();
      // Default markets setup
      let topMarkets = [
        'MKR', 'OPEN.MKR', CORE_ASSET, 'OPEN.ETH', 'ICOO', 'BTC', 'OPEN.LISK', // eslint-disable-line
        'OPEN.STEEM', 'OPEN.DAO', 'PEERPLAYS', 'USD', 'CNY', 'BTSR', 'OBITS',
        'OPEN.DGD', 'EUR', 'TRADE.BTC', 'CASH.BTC', 'GOLD', 'SILVER',
        'OPEN.USDT', 'OPEN.EURT', 'OPEN.BTC', 'CADASTRAL'
      ];

      function addMarkets(target, base, markets) {
        markets.filter((a) => {
          return a !== base;
        }).forEach((market) => {
          target.push([`${market}_${base}`, {'quote': market,'base': base}]);
        });
      }

      let defaultMarkets = [];
      state.settings.defaults.preferredBases.forEach((base) => {
        addMarkets(defaultMarkets, base, topMarkets);
      });
    };
  }


  static getMarketStats() {
    return (dispatch, getState) => {
      clearTimeout(marketStatsTimeout);
      let state = getState(),
        currentTab = state.exchangePageReducer.currentTab,
        mainAssetSymbol = state.settings.defaults.preferredBases[currentTab],
        topMarkets = state.settings.defaults.topMarkets,
        allNeededAssets = [mainAssetSymbol, ...topMarkets],
        filteredAssets = [];
      allNeededAssets.forEach((assetSymbol) => {
        if (!assetsCacheBySymbol[assetSymbol]) {
          filteredAssets.push(assetSymbol);
        }
      });
      Promise.all([(filteredAssets.length ? AssetRepository.fetchAssetsByIds(filteredAssets, true)
        .then((results) => {
          results.forEach((asset) => {
            if (asset) {
              assetsCacheById[asset.id] = asset;
              assetsCacheBySymbol[asset.symbol] = asset;
            }
          });
        }): [])]).then(() => {

        // Generate tabs
        let currentHashTabs = {};
        state.exchangePageReducer.tabs.forEach((tab) => {
          currentHashTabs[tab.id] = tab;
        });
        let tabs = [];
        let needDispatch = false;
        state.settings.defaults.preferredBases.forEach((symbol) => {
          let asset = assetsCacheBySymbol[symbol];

          if (asset) {
            let baseAssetName = AssetNameHelper.getAssetName(asset);

            if (!currentHashTabs[symbol]) {
              needDispatch = true;
            }

            tabs.push({
              id: symbol,
              prefix: baseAssetName.prefix,
              name: baseAssetName.name
            });
          }
        });

        if (needDispatch) {
          dispatch(ExchangePagePrivateActions.changeExchangeMarketsAction({
            tabs: tabs
          }));
        }

        // Fetch tab stats
        ExchangeService.fetchTabStats(mainAssetSymbol, topMarkets, assetsCacheBySymbol)
          .then((marketRows) => {
            dispatch(ExchangePagePrivateActions.changeExchangeMarketsRowsAction({
              marketRowsData: marketRows,
              marketRowsDataLoaderIsShow: false
            }));
            marketStatsTimeout = setTimeout(() => {
              dispatch(ExchangePageActions.getMarketStats());
            }, 25000);
          });
      });
    };
  }

  static setMarketTab(currentTab) {
    return (dispatch) => {
      dispatch(ExchangePagePrivateActions.changeExchangeMarketsTabAction({
        currentTab: currentTab,
        marketRowsDataLoaderIsShow: true
      }));
      setTimeout(() => {
        dispatch(ExchangePageActions.getMarketStats());
      }, 0);
    };
  }

  static changeExchangeMarketsRowsSort(type) {
    return (dispatch, getState) => {
      let state = getState(),
        marketRowsDataSortBy = state.exchangePageReducer.marketRowsDataSortBy,
        marketRowsDataSortInvert = state.exchangePageReducer.marketRowsDataSortInvert;

      if (type !== state.exchangePageReducer.marketRowsDataSortBy) {
        marketRowsDataSortBy = type;
      } else {
        marketRowsDataSortInvert = !marketRowsDataSortInvert;
      }

      dispatch(ExchangePagePrivateActions.changeExchangeMarketsRowsSortAction({
        marketRowsDataSortBy: marketRowsDataSortBy,
        marketRowsDataSortInvert: marketRowsDataSortInvert
      }));
    };
  }

  static changePriceChartPeriod(period) {
    return (dispatch) => {
      dispatch(ExchangePagePrivateActions.changeExchangePriceChartPeriodAction({
        priceChartCurrentPeriod: period
      }));
    };
  }

  static changePriceChartLoader(status) {
    return (dispatch) => {
      dispatch(ExchangePagePrivateActions.changePriceChartLoaderAction({
        priceChartStatusLoader: status
      }));
    };
  }

  static changePriceChartBucket(bucket) {
    return (dispatch, getState) => {
      let state = getState();
      dispatch(ExchangePagePrivateActions.changePriceChartLoaderAction({
        priceChartStatusLoader: 'process'
      }));
      ExchangeService.fetchChartData(
        state.exchangePageReducer.quoteAssetSymbol,
        state.exchangePageReducer.baseAssetSymbol,
        bucket
      ).then((data) => {
        dispatch(ExchangePagePrivateActions.changePriceChartBucketsAction({
          buckets: data.buckets
        }));

        if (data.buckets.indexOf(bucket) !== -1) {
          dispatch(ExchangePagePrivateActions.changePriceChartBucketAction({
            priceData: data.priceData.priceData,
            highPriceList: data.priceData.highPriceList,
            currentBucket: bucket
          }));
        }

        dispatch(ExchangePagePrivateActions.changePriceChartLoaderAction({
          priceChartStatusLoader: 'default'
        }));
      });
    };
  }

  static setBalances(data){
    return (dispatch) => {
      dispatch(ExchangePagePrivateActions.setExchangeBalances({
        coreAssetBalance : data.coreAssetBalance,
        baseAssetBalance : data.baseAssetBalance,
        quoteAssetBalance : data.quoteAssetBalance
      }));
    };
  }

  static removeOrderFromPage() {
    return (dispatch, getState)=> {
      let selfState = getState().exchangePageReducer;
      let baseAssetSymbol = selfState.baseAssetSymbol;
      let quoteAssetSymbol = selfState.quoteAssetSymbol;

      // Fetch depth chart data
      ExchangeService.fetchChartDepthData(quoteAssetSymbol, baseAssetSymbol)
        .then((chartDepthData) => {
          dispatch(ExchangePagePrivateActions.setDepthChartDataAction(chartDepthData));
        });
    };
  }
}

export default ExchangePageActions;
