import {
    EXCHANGE_SET_DATA,
    EXCHANGE_SET_MARKETS_DATA,
    EXCHANGE_SET_MARKETS_TAB,
    EXCHANGE_SET_MARKETS_ROWS,
    EXCHANGE_SET_MARKETS_ROWS_SORT,
    EXCHANGE_SET_MARKETS_ROWS_LOADER,
    EXCHANGE_SET_PRICE_CHART_DATA,
    EXCHANGE_SET_PRICE_CHART_PERIOD,
    EXCHANGE_SET_CURRENT_ASSETS_DATA,
    EXCHANGE_CHANGE_PRICE_CHART_BUCKET,
    EXCHANGE_CHANGE_PRICE_CHART_BUCKETS,
    EXCHANGE_CHANGE_PRICE_CHART_LOADER,
    EXCHANGE_SET_DEPTH_CHART_DATA,
    EXCHANGE_SET_BALANCES
    } from "../constants/ActionTypes";
import Immutable from "immutable";
import MarketRepository from '../repositories/MarketRepository';
import AssetRepository from '../repositories/AssetRepository';

import ExchangeService from "../services/ExchangeService"//TODO::rm

import AssetNameHelper from "../helpers/AssetNameHelper";
import Repository from "repositories/chain/repository";


import {ChainStore, EmitterInstance} from "peerplaysjs-lib";
let emitter = EmitterInstance.emitter();


import ls from "common/localStorage";

let storage = new ls("__peerplays__");

let marketStatsTimeout = null;

/**
 * Private Redux Action Creator (EXCHANGE_SET_DATA)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangeDataAction(data) {
    return {
        type: EXCHANGE_SET_DATA,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_MARKETS_DATA)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangeMarketsAction(data) {
    return {
        type: EXCHANGE_SET_MARKETS_DATA,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_MARKETS_TAB)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangeMarketsTabAction(data) {
    return {
        type: EXCHANGE_SET_MARKETS_TAB,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_MARKETS_ROWS)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangeMarketsRowsAction(data) {
    return {
        type: EXCHANGE_SET_MARKETS_ROWS,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_MARKETS_ROWS_SORT)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangeMarketsRowsSortAction(data) {
    return {
        type: EXCHANGE_SET_MARKETS_ROWS_SORT,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_PRICE_CHART_DATA)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangePriceChartAction(data) {
    return {
        type: EXCHANGE_SET_PRICE_CHART_DATA,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_PRICE_CHART_PERIOD)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeExchangePriceChartPeriodAction(data) {
    return {
        type: EXCHANGE_SET_PRICE_CHART_PERIOD,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_CURRENT_ASSETS_DATA)
 * @param data
 * @returns {{type, payload: *}}
 */
function changeCurrentAssetsDataAction(data) {
    return {
        type: EXCHANGE_SET_CURRENT_ASSETS_DATA,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_BUCKET)
 * @param data
 * @returns {{type, payload: *}}
 */
function changePriceChartBucketAction(data) {
    return {
        type: EXCHANGE_CHANGE_PRICE_CHART_BUCKET,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_BUCKETS)
 * @param data
 * @returns {{type, payload: *}}
 */
function changePriceChartBucketsAction(data) {
    return {
        type: EXCHANGE_CHANGE_PRICE_CHART_BUCKETS,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_CHANGE_PRICE_CHART_LOADER)
 * @param data
 * @returns {{type, payload: *}}
 */
function changePriceChartLoaderAction(data) {
    return {
        type: EXCHANGE_CHANGE_PRICE_CHART_LOADER,
        payload: data
    }
}
/**
 * Private Redux Action Creator (EXCHANGE_SET_DEPTH_CHART_DATA)
 * @param data
 * @returns {{type, payload: *}}
 */
function setDepthChartDataAction(data) {
    return {
        type: EXCHANGE_SET_DEPTH_CHART_DATA,
        payload: data
    }
}

/**
 * Private Redux Action Creator (EXCHANGE_SET_BALANCES)
 * @param data
 * @returns {{type, payload: *}}
 */
function setExchangeBalances(data){
    return {
        type : EXCHANGE_SET_BALANCES,
        payload: data
    }
}


let assetsCacheBySymbol = {};
let assetsCacheById = {};

let subscribers = {};
let currentDeleting = {};
let stack = [];


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

            let coreAssetSymbol = CORE_ASSET;

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

                dispatch(changeCurrentAssetsDataAction({
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
        }
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

                    MarketRepository.unSubscribeFromMarket(sub.quoteAssetId , sub.baseAssetId, sub.subscribeFunction).then(() => {

                        console.warn('[APP] UNSUBSCRIBE', subKey);

                        delete subscribers[subKey];
                        delete currentDeleting[subKey];

                        dispatch(ExchangePageActions.processStack());

                    });

                });
            }

        }
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

                MarketRepository.subscribeToMarket(subscribeObject.quoteAssetId , subscribeObject.baseAssetId, subscribeFunction).then(() => {

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

            /**
             * Fetch depth chart data
             */
            ExchangeService.fetchChartDepthData(quoteAssetSymbol, baseAssetSymbol).then((chartDepthData) => {
                dispatch(setDepthChartDataAction(chartDepthData));
            });

            /**
             * Fetch price chart data
             */
            ExchangeService.fetchChartData(quoteAssetSymbol, baseAssetSymbol, selfState.currentBucket).then((data) => {
                dispatch(changePriceChartBucketsAction({
                    buckets: data.buckets
                }));

                dispatch(changeExchangePriceChartAction({
                    highPriceList: data.priceData.highPriceList,
                    priceData: data.priceData.priceData
                }));
            });

            /**
             * Fetch exchange data
             */
            ExchangeService.fetchExchangeData(quoteAssetSymbol, baseAssetSymbol).then((data) => {
                dispatch(changeExchangeDataAction(data));
            });
        };
    }


    static initStarredMarkets()
    {
        return (dispatch, getState) => {

            let state = getState();

            // Default markets setup
            let topMarkets = [
                "MKR", "OPEN.MKR", CORE_ASSET, "OPEN.ETH", "ICOO", "BTC", "OPEN.LISK",
                "OPEN.STEEM", "OPEN.DAO", "PEERPLAYS", "USD", "CNY", "BTSR", "OBITS",
                "OPEN.DGD", "EUR", "TRADE.BTC", "CASH.BTC", "GOLD", "SILVER",
                "OPEN.USDT", "OPEN.EURT", "OPEN.BTC", "CADASTRAL"
            ];

            let marketsString = "markets";

            function addMarkets(target, base, markets) {
                markets.filter(a => {
                    return a !== base;
                }).forEach(market => {
                    target.push([`${market}_${base}`, {"quote": market,"base": base}]);
                });
            }

            let defaultMarkets = [];

            state.settings.defaults.preferredBases.forEach(base => {
                addMarkets(defaultMarkets, base, topMarkets);
            });

            let starredMarkets = Immutable.Map(storage.get(marketsString, defaultMarkets));



        }
    }


    static getMarketStats()
    {
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

            Promise.all([(filteredAssets.length ? AssetRepository.fetchAssetsByIds(filteredAssets, true).then((results) => {

                results.forEach((asset) => {
                    if (asset) {
                        assetsCacheById[asset.id] = asset;
                        assetsCacheBySymbol[asset.symbol] = asset;
                    }

                });

            }): [])]).then(() => {



                /**
                 * Generate tabs
                 */
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
                    dispatch(changeExchangeMarketsAction({
                        tabs: tabs
                    }));
                }

                /**
                 * Fetch tab stats
                 */

                ExchangeService.fetchTabStats(mainAssetSymbol, topMarkets, assetsCacheBySymbol).then((marketRows) => {

                    dispatch(changeExchangeMarketsRowsAction({
                                marketRowsData: marketRows,
                                marketRowsDataLoaderIsShow: false
                            }));

                    marketStatsTimeout = setTimeout(() => {
                        dispatch(ExchangePageActions.getMarketStats());
                    }, 25000);

                });


            });


        }
    }

    static setMarketTab(currentTab) {

        return (dispatch, getState) => {

            dispatch(changeExchangeMarketsTabAction({
                currentTab: currentTab,
                marketRowsDataLoaderIsShow: true
            }));

            setTimeout(() => {
                dispatch(ExchangePageActions.getMarketStats());
            }, 0)


        }
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

            dispatch(changeExchangeMarketsRowsSortAction({
                marketRowsDataSortBy: marketRowsDataSortBy,
                marketRowsDataSortInvert: marketRowsDataSortInvert
            }));

        }
    }

    static changePriceChartPeriod(period) {
        return (dispatch, getState) => {
            let state = getState();

            dispatch(changeExchangePriceChartPeriodAction({
                priceChartCurrentPeriod: period
            }));

        }
    }

    static changePriceChartLoader(status) {
        return (dispatch, getState) => {

            dispatch(changePriceChartLoaderAction({
                priceChartStatusLoader: status
            }));

        }
    }

    static changePriceChartBucket(bucket) {
        return (dispatch, getState) => {

            let state = getState();

            dispatch(changePriceChartLoaderAction({
                priceChartStatusLoader: 'process'
            }));
            ExchangeService.fetchChartData(state.exchangePageReducer.quoteAssetSymbol, state.exchangePageReducer.baseAssetSymbol, bucket).then((data) => {

                dispatch(changePriceChartBucketsAction({
                    buckets: data.buckets
                }));

                if (data.buckets.indexOf(bucket) !== -1) {
                    dispatch(changePriceChartBucketAction({
                        priceData: data.priceData.priceData,
                        highPriceList: data.priceData.highPriceList,
                        currentBucket: bucket
                    }));
                }

                dispatch(changePriceChartLoaderAction({
                    priceChartStatusLoader: 'default'
                }));
            });

        }
    }

    static setBalances(data){
        return (dispatch, getState)=>{
            dispatch(setExchangeBalances({
                coreAssetBalance : data.coreAssetBalance,
                baseAssetBalance : data.baseAssetBalance,
                quoteAssetBalance : data.quoteAssetBalance
            }));
        };
    }


    static removeOrderFromPage(orderId){
        return (dispatch, getState)=> {


            let selfState = getState().exchangePageReducer;

            let baseAssetSymbol = selfState.baseAssetSymbol;
            let quoteAssetSymbol = selfState.quoteAssetSymbol;

            /**
             * Fetch depth chart data
             */

            ExchangeService.fetchChartDepthData(quoteAssetSymbol, baseAssetSymbol).then((chartDepthData) => {
                dispatch(setDepthChartDataAction(chartDepthData));
            });

        };
    }
}


export default ExchangePageActions;
