import Immutable from 'immutable';
import {ChainStore} from 'peerplaysjs-lib';
import Repository from '../repositories/chain/repository';
import {formatOperation} from './FormatOperation';
import utils from 'common/utils';
import market_utils from 'common/market_utils';
import asset_utils from 'common/asset_utils';

let dataIsFetched = false;
let marketStatsByName = {},
  cacheData = {
    assets: [],
    amounts: [],
    marketStatsByName: [],
    collateral: {},
    debt: {},
    openOrders: {},
    history: [],
    lastBlock: null
  };

//TODO:: as Redux Derived data
/**
 * Dashboard Balance Service
 * It is used to control the balances on the page Dashboard
 */
class DashboardBalancesService {
  /**
   *
   * @param {string} accountId
   * @param {string} unit
   * @param {array} settingsAssets
   */
  static fetchCurrentBalance(accountId, unit = CORE_ASSET, settingsAssets = []) { // TODO: import
    let openOrders = {};
    let collateral = {};
    let debt = {};

    return Promise.all([
      Repository.fetchFullAccount(accountId),
      Repository.fetchObject('2.0.0'),
      Repository.fetchObject('2.1.0'),
      Repository.fetchObject('1.3.0')
    ]).then((results) => {
      let account = results[0].toJS();
      let object200 = results[1]; //.toJS();
      let object210 = results[2]; //.toJS();
      let object130 = results[3]; //.toJS();

      if (account && account.orders && account.orders.length) {
        let orderPromises = account.orders.map((order) => Repository.getObject(order));
        Promise.all(orderPromises).then((results) => {
          let orders = results.map((o) => o.toJS());
          orders.forEach((order) => {
            let orderAsset = order.sell_price.base.asset_id;

            if (!openOrders[orderAsset]) {
              openOrders[orderAsset] = parseInt(order.for_sale, 10);
            } else {
              openOrders[orderAsset] += parseInt(order.for_sale, 10);
            }
          });
        });
      }

      if (account && account.call_orders && account.call_orders.length) {
        let callOrderPromises = account.call_orders.map((coId) => Repository.getObject(coId));
        Promise.all(callOrderPromises).then((results) => {
          let callOrders = results.map((co) => co.toJS());
          callOrders.forEach((callOrder) => {
            let collateralAsset = callOrder.call_price.base.asset_id;

            if (!collateral[collateralAsset]) {
              collateral[collateralAsset] = parseInt(callOrder.collateral, 10);
            } else {
              collateral[collateralAsset] += parseInt(callOrder.collateral, 10);
            }

            let debtAsset = callOrder.call_price.quote.asset_id;

            if (!debt[debtAsset]) {
              debt[debtAsset] = parseInt(callOrder.debt, 10);
            } else {
              debt[debtAsset] += parseInt(callOrder.debt, 10);
            }
          });
        });
      }

      /**
       * Assets
       */
      let assetsIds = ['1.3.0', unit];

      settingsAssets.forEach((assetId) => {
        if (assetsIds.indexOf(assetId) === -1) {
          assetsIds.push(assetId);
        }
      });

      let amounts = []; //???CHECK
      let balancePromises = [];

      for (let assetId in account.balances) {
        assetsIds.push(assetId);
        balancePromises.push(Repository.getObject(account.balances[assetId]));
      }

      return Promise.all(balancePromises).then((results) => {
        let balances = results.map((b) => b.toJS());
        balances.map((balance) => amounts.push({
          asset_id: balance.asset_type,
          amount: parseInt(balance.balance, 10)
        }));

        let assetPromises = assetsIds.map((id) => Repository.getAsset(id));

        return Promise.all(assetPromises).then((results) => {
          let assets = results.filter((res) => {
            return res;
          }).map((a) => a.toJS());

          let bitassetsIds = [];
          let bitassetsHash = {};

          assets.forEach((asset) => {
            if (asset.bitasset_data_id) {
              if (!bitassetsHash[asset.bitasset_data_id]) {
                bitassetsHash[asset.bitasset_data_id] = asset.bitasset_data_id;
                bitassetsIds.push(asset.bitasset_data_id);
              }
            }
          });

          let bitassetPromises = bitassetsIds.map((baId) => Repository.getObject(baId));
          return Promise.all(bitassetPromises).then((results) => {
            let bitassets = results.map((ba) => ba.toJS());
            let bitAssetsHash = {};

            bitassets.forEach((bitasset) => {
              bitAssetsHash[bitasset.id] = bitasset;
            });

            assets.forEach((asset) => {
              if (asset.bitasset_data_id && bitAssetsHash[asset.bitasset_data_id]) {
                asset.bitasset = bitAssetsHash[asset.bitasset_data_id];
              }
            });

            // let endDate = new Date();
            // let startDateShort = new Date();
            //
            // let baseAsset = assets.find((asset) => {
            // 	return asset.id === '1.3.0';
            // });
            //
            // endDate.setDate(endDate.getDate() + 1);
            // startDateShort = new Date(startDateShort.getTime() - 3600 * 50 * 1000);

            // let promisesStats = [];

            // assets.forEach((asset) => {
            // 	promisesStats.push(
            // self.calcStats(asset, baseAsset, startDateShort.toISOString().slice(0, -5),
            // endDate.toISOString().slice(0, -5)));
            // });
            //
            // return Promise.all(promisesStats).then(() => {

            cacheData.assets = assets;
            cacheData.amounts = amounts;
            cacheData.marketStatsByName = marketStatsByName;
            cacheData.collateral = collateral;
            cacheData.debt = debt;
            cacheData.openOrders = openOrders;
            cacheData.history = account.history;
            cacheData.account = account;
            cacheData.obj200 = object200;
            cacheData.obj210 = object210;
            cacheData.obj130 = object130;

            dataIsFetched = true;

            return true;

            // });
          });
        });

      });
    });
  }

  /**
   *
   * @param {string} accountId
   * @param {Immutable.Map} vestingBalances
   */
  static calculateVesting(accountId, vestingBalances) {
    return Repository.fetchFullAccount(accountId).then((account) => {
      if (!account) {
        return null;
      }

      let vesting_balances_ids = account.get('vesting_balances'),
        vestingPromises = vesting_balances_ids ? vesting_balances_ids.map((balanceId) => {
          return Repository.getObject(balanceId);
        }) : [];

      return Promise.all(
        [Promise.all(vestingPromises),
          Repository.getAsset(CORE_ASSET)]) // TODO: declare via import form above
        .then(([balances, asset]) => {
          if (balances && balances.length) {
            balances.forEach((balance) => {

              if (balance) {
                let currBalance = vestingBalances.get(balance.get('id'));

                if (!currBalance || currBalance !== balance) {
                  vestingBalances = vestingBalances.set(balance.get('id'), balance);
                }
              }
            });
          }

          return {
            vestingBalancesIds: vesting_balances_ids ? vesting_balances_ids : [],
            vestingBalances: vestingBalances,
            vestingAsset: asset
          };
        });
    });
  }

  /**
   *
   * @param {array} units
   * @returns {{}}
   */
  static calculateAvailableBalances(units) {
    let data = {};
    units.forEach((unit) => {
      let calculatedData = DashboardBalancesService.calculate(unit);

      if (calculatedData) {
        data[unit] = calculatedData;
      }
    });

    return data;
  }

  /**
   *
   * @param {string} unit
   * @param {array} hiddenAssets
   * @returns {*}
   */
  static calculate(unit, hiddenAssets = []) {

    if (!dataIsFetched) {
      return null;
    }

    let {
      assets,
      amounts,
      collateral,
      debt,
      openOrders,
      lastBlock
    } = cacheData;
    let baseAsset = assets.find((asset) => {
      return asset.id === '1.3.0';
    });
    let toAsset = assets.find((asset) => {
      return asset.symbol === unit;
    });

    let dataBalances = this.getBalances(
      baseAsset,
      assets,
      toAsset,
      amounts,
      marketStatsByName,
      collateral,
      debt,
      openOrders
    );
    let fiatIds = ['1.3.102'], // eslint-disable-line
      cryptoIds = ['1.3.1', '1.3.2'];
    let coreTokenTotal = 0,
      fiatTotal = 0,
      cryptoTokensTotal = 0,
      smartCoinTotal = 0,
      otherAssetsTotal = 0;
    let coreSymbol = baseAsset.symbol,
      assetSymbol = toAsset.symbol;
    let coreToken = Immutable.List(),
      fiat = Immutable.List(),
      cryptoTokens = Immutable.List(),
      smartCoins = Immutable.List(),
      otherAssets = Immutable.List();

    for (let asset in dataBalances) {
      if (dataBalances.hasOwnProperty(asset)) {
        let precision = utils.get_asset_precision(dataBalances[asset]['asset']['precision']),
          decimals = dataBalances[asset]['asset']['precision'];
        let descriptionJSON = dataBalances[asset]['asset']['options']['description'];
        let description = descriptionJSON;

        try {
          description = JSON.parse(descriptionJSON);
        } catch (e) {
          description = {};
        }

        let id = dataBalances[asset]['asset']['id'],
          symbol = dataBalances[asset]['asset']['symbol'],
          name = asset_utils.getName(symbol, description.short_name
            ? description.short_name
            : 'N/A'
          );

        let info = Immutable.Map({
          id,
          name,
          precision,
          decimals,
          hidden: hiddenAssets.indexOf(dataBalances[asset]['asset']['id']) !== -1,
          symbol,
          available: dataBalances[asset]['available'],
          orders: dataBalances[asset]['orders'],
          collateral: dataBalances[asset]['collateral'],
          totalBalance: dataBalances[asset]['totalBalance'],
          totalValue: dataBalances[asset]['totalValue']
        });

        switch (true) {
          case asset === baseAsset.id:
            coreTokenTotal += dataBalances[asset]['totalValue'];
            coreToken = coreToken.push(info);
            break;
            //case  !!fiatIds.find(value=>value == asset):
            //    fiatTotal += dataBalances[asset]['totalValue'];
            //    fiat = fiat.push(info);
            //    break;
            //case  !!dataBalances[asset]['asset']['bitasset']:
            //    smartCoinTotal += dataBalances[asset]['totalValue'];
            //    smartCoins = smartCoins.push(info);
            //    break;
          case !!cryptoIds.find((value) => value === asset):

            if (
              dataBalances[asset]['totalValue'] > 0
              || dataBalances[asset]['totalBalance'] > 0
              || dataBalances[asset]['available'] > 0
            ) {
              cryptoTokensTotal += dataBalances[asset]['totalValue'];
              cryptoTokens = cryptoTokens.push(info);
            }

            break;
          default:
            otherAssetsTotal += dataBalances[asset]['totalValue'];
            otherAssets = otherAssets.push(info);
        }
      }
    }

    let corePrecision = utils.get_asset_precision(toAsset.precision),
      coreDecimals = toAsset.precision;

    return {
      dataBalances: dataBalances,
      coreSymbol: coreSymbol,
      assetSymbol: assetSymbol,
      precision: corePrecision,
      decimals: coreDecimals,
      coreTokenTotal: coreTokenTotal,
      fiatTotal: fiatTotal,
      cryptoTokensTotal: cryptoTokensTotal,
      smartCoinTotal: smartCoinTotal,
      otherAssetsTotal: otherAssetsTotal,
      coreToken,
      fiat,
      cryptoTokens,
      smartCoins,
      otherAssets,
      lastBlock
    };
  }

  /**
   *
   * @param {array} history
   * @param {object} baseAsset
   * @param {object} quoteAsset
   * @param {array} recent
   * @returns {{change: string, volumeBase: *, volumeQuote: *, close: *, latestPrice: *}}
   * @private
   */
  static _calcMarketStats(history, baseAsset, quoteAsset, recent) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.getTime();
    let volumeBase = 0,
      volumeQuote = 0,
      change = 0,
      last = {
        close_quote: null,
        close_base: null
      },
      invert,
      latestPrice,
      noTrades = true;

    if (history.length) {
      let first;
      history.forEach((bucket, i) => {
        let date = new Date(bucket.key.open + '+00:00').getTime();

        if (date > yesterday) {
          noTrades = false;

          if (!first) {
            first = history[i > 0 ? i - 1 : i];
            invert = first.key.base === baseAsset.id;
          }

          if (invert) {
            volumeBase += parseInt(bucket.base_volume, 10);
            volumeQuote += parseInt(bucket.quote_volume, 10);
          } else {
            volumeQuote += parseInt(bucket.base_volume, 10);
            volumeBase += parseInt(bucket.quote_volume, 10);
          }
        }
      });

      if (!first) {
        first = history[0];
      }

      last = history[history.length - 1];
      let open, close;

      if (invert) {
        open = utils.get_asset_price(
          first.open_quote, quoteAsset, first.open_base, baseAsset, invert
        );
        close = utils.get_asset_price(
          last.close_quote, quoteAsset, last.close_base, baseAsset, invert
        );
      } else {
        open = utils.get_asset_price(
          first.open_quote, baseAsset, first.open_base, quoteAsset, invert
        );
        close = utils.get_asset_price(
          last.close_quote, baseAsset, last.close_base, quoteAsset, invert
        );
      }

      change = noTrades ? 0 : Math.round(10000 * (close - open) / open) / 100;
    }

    if (recent && recent.length && recent.length > 1) {
      let order = recent[1].op;
      let paysAsset, receivesAsset, isAsk = false;

      if (order.pays.asset_id === baseAsset.id) {
        paysAsset = baseAsset;
        receivesAsset = quoteAsset;
        isAsk = true;
      } else {
        paysAsset = quoteAsset;
        receivesAsset = baseAsset;
      }

      let flipped = baseAsset.get('id').split('.')[2] > quoteAsset.id.split('.')[2];
      latestPrice = market_utils.parse_order_history(
        order, paysAsset, receivesAsset, isAsk, flipped
      ).full;
    }

    let close = last.close_base && last.close_quote ? {
      quote: {
        amount: invert ? last.close_quote : last.close_base,
        asset_id: invert ? last.key.quote : last.key.base
      },
      base: {
        amount: invert ? last.close_base : last.close_quote,
        asset_id: invert ? last.key.base : last.key.quote
      }
    } : null;

    return {
      change: change.toFixed(2),
      volumeBase: utils.get_asset_amount(volumeBase, baseAsset),
      volumeQuote: utils.get_asset_amount(volumeQuote, quoteAsset),
      close: close,
      latestPrice
    };
  }

  // static calcStats(asset, baseAsset, start, end) {
  // 	return Promise.all([
  // 		HistoryRepository.fetchMarketHistory(baseAsset.id, asset.id, 3600, start, end),
  // 		HistoryRepository.fetchFillOrderHistory(baseAsset.id, asset.id, 1)
  // 	]).then(result => {
  //
  // 		let history = result[0],
  // 			last = result[1],
  // 			stats = this._calcMarketStats(history, baseAsset, asset, last),
  // 			marketName = asset.symbol + "_" + baseAsset.symbol;
  //
  // 		marketStatsByName[marketName] = stats;
  //
  // 	});
  // }

  /**
   *
   * @param {object} coreAsset
   * @param {array} fromAssets
   * @param {object} toAsset
   * @param {array} balances
   * @param {object} marketStats
   * @param {object} collateral
   * @param {object} debt
   * @param {object} openOrders
   * @returns {*}
   */
  static getBalances(
    coreAsset,
    fromAssets,
    toAsset,
    balances,
    marketStats,
    collateral,
    debt,
    openOrders
  ) {
    //let coreAsset = ChainStore.getAsset("1.3.0");

    if (!coreAsset || !toAsset) {
      return null;
    }

    let assetData = {};

    fromAssets.forEach((asset) => {
      if (asset) {
        assetData[asset.id] = {
          asset,
          available: 0,
          orders: 0,
          debt: 0,
          collateral: 0,
          totalBalance: 0,
          totalValue: 0
        };
      }
    });

    // Balance value
    balances.forEach((balance) => {
      if (assetData.hasOwnProperty(balance.asset_id)) {
        assetData[balance.asset_id]['available'] = balance.amount;
        assetData[balance.asset_id]['totalBalance'] = balance.amount;

        if (balance.asset_id === toAsset.id) {
          assetData[balance.asset_id]['totalValue'] = balance.amount;
        } else {
          let fromAsset = assetData[balance.asset_id]['asset'];

          if (fromAsset) {
            let eqValue = this.convertValue(
              balance.amount, fromAsset, toAsset, marketStats, coreAsset
            );
            assetData[balance.asset_id]['totalValue'] = eqValue ? eqValue : 0;
          }
        }
      }
    });

    // Open orders value
    for (let asset in openOrders) {
      if (openOrders.hasOwnProperty(asset) && assetData.hasOwnProperty(asset)) {
        assetData[asset]['orders'] += openOrders[asset];
        assetData[asset]['totalBalance'] += openOrders[asset];

        if (asset === toAsset.id) {
          assetData[asset]['totalValue'] += openOrders[asset];
        } else {
          let fromAsset = assetData[asset]['asset'];

          if (fromAsset) {
            assetData[asset]['totalValue'] += this.convertValue(
              openOrders[asset], fromAsset, toAsset, marketStats, coreAsset
            );
          }
        }

      }
    }

    // Debt value
    // for (let asset in debt) {
    //     if(assetData.hasOwnProperty(asset)){
    //
    //         assetData[asset]['debt'] += debt[asset];
    //         assetData[asset]['totalBalance'] -= debt[asset];
    //
    //
    //         if (asset === toAsset.get("id")) {
    //             assetData[asset]['totalValue'] -= debt[asset];
    //         } else {
    //             let fromAsset = assetData[asset]['asset'];
    //
    //             if (fromAsset) {
    //                 let orderValue = this
    // .convertValue(debt[asset], fromAsset, toAsset, marketStats, coreAsset);
    //                 assetData[asset]['totalValue'] -= orderValue;
    //             }
    //         }
    //
    //
    //     }
    // }

    for (let asset in collateral) {
      if (collateral.hasOwnProperty(asset) && assetData.hasOwnProperty(asset)) {
        assetData[asset]['collateral'] += collateral[asset];
        assetData[asset]['totalBalance'] += collateral[asset];

        if (asset === toAsset.id) {
          assetData[asset]['totalValue'] += collateral[asset];
        } else {
          let fromAsset = assetData[asset]['asset'];

          if (fromAsset) {
            assetData[asset]['totalValue'] += this.convertValue(
              collateral[asset], fromAsset, toAsset, marketStats, coreAsset
            );
          }
        }
      }
    }

    return assetData;
  }

  /**
   *
   * @param {number} amount
   * @param {object} fromAsset
   * @param {object} toAsset
   * @param {object} marketStats
   * @param {object} coreAsset
   * @returns {*}
   */
  static convertValue(amount, fromAsset, toAsset, marketStats, coreAsset) {
    if (!fromAsset || !toAsset) {
      return 0;
    }

    let toStats, fromStats;

    let toID = toAsset.id;
    let toSymbol = toAsset.symbol;
    let fromID = fromAsset.id;
    let fromSymbol = fromAsset.symbol;

    if (coreAsset && marketStats) {
      let coreSymbol = coreAsset.symbol;

      toStats = marketStats[toSymbol + '_' + coreSymbol];
      fromStats = marketStats[fromSymbol + '_' + coreSymbol];

    }

    let price = utils.convertPriceObj(fromStats && fromStats.close ? fromStats.close :
      fromID === '1.3.0' || fromAsset.bitasset ? fromAsset : null,
    toStats && toStats.close ? toStats.close :
      (toID === '1.3.0' || toAsset.bitasset) ? toAsset : null,
    fromID,
    toID);

    return price ? utils.convertValueObj(price, amount, fromAsset, toAsset) : null;
  }

  /**
   * get Recent Activity And OpenOrders data
   *
   * @returns {{recentActivity: Array, openOrders: Array, blockInterval: null, headBlockNumber: null}}
   */
  static getRecentActivityAndOpenOrdersData() {
    let {
      history,
      obj200,
      obj210,
    } = cacheData;

    let blockInterval = obj200 ? obj200.get('parameters').get('block_interval') : null;
    let headBlockNumber = obj210 ? obj210.get('head_block_number') : null;

    let orderOperations = history ? history.filter((obj) => {
      if (obj.op[0] === 1) {
        return ChainStore.getObject(obj.result[1]);
      }

      return false;
    }) : null;
    let openOrders = orderOperations ? orderOperations.map((obj) => {
      let isAsk = obj.op[1].amount_to_sell.asset_id !== '1.3.0'; // market_utils.isAskOp(obj.op[1]);

      let order = ChainStore.getObject(obj.result[1]).toJS(); // eslint-disable-line
      let sellOrBuy = isAsk ? 'Buy' : 'Sell';
      let priceObj = {
        base: isAsk ? obj.op[1].min_to_receive : obj.op[1].amount_to_sell,
        quote: isAsk ? obj.op[1].amount_to_sell : obj.op[1].min_to_receive
      };
      let baseAsset = ChainStore.getAsset(priceObj.base.asset_id);
      let baseAmount = baseAsset
        ? priceObj.base.amount / Math.pow(10, baseAsset.get('precision'))
        : null;
      let quoteAsset = ChainStore.getAsset(priceObj.quote.asset_id);
      let quoteAmount = quoteAsset
        ? priceObj.quote.amount / Math.pow(10, quoteAsset.get('precision'))
        : null;

      let price = baseAsset && quoteAsset ? {
        amount: Math.round(
          quoteAmount / baseAmount * Math.pow(10, quoteAsset.get('precision')))
          / Math.pow(10, quoteAsset.get('precision')),
        baseAsset: baseAsset.toJS(),
        quoteAsset: quoteAsset.toJS()
      } : null;

      let total = quoteAsset ? {
        amount: utils.round_number(quoteAmount, quoteAsset),
        asset: quoteAsset.toJS()
      } : null;

      let amount = baseAsset ? {
        amount: utils.round_number(baseAmount, baseAsset),
        asset: baseAsset.toJS()
      } : null;

      return {
        id: obj.id,
        sellOrBuy,
        price,
        amount,
        total,
        block: obj.block_num
      };
    }) : [];

    const MAX_HISTORY_ITEMS = 100;

    if (history) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    let recentActivity = history ? history.map((obj) => {
      let {
        type,
        sender,
        receiver,
        description,
        operation,
        memo
      } = formatOperation(obj);
      return {
        id: obj.id,
        type,
        sender,
        receiver,
        description,
        operation,
        block: obj.block_num,
        memo
      };
    }) : [];

    return {
      recentActivity,
      openOrders,
      blockInterval,
      headBlockNumber
    };
  }
}

export default DashboardBalancesService;