import Immutable from 'immutable';
import utils from 'common/utils';
import AssetNameHelper from '../helpers/AssetNameHelper';
import AssetRepository from '../repositories/AssetRepository';
import HistoryRepository from '../repositories/HistoryRepository';
import OrderRepository from '../repositories/OrderRepository';
import Repository from 'repositories/chain/repository';
import ExchangeMarketService from 'services/ExchangeMarketService';
import MarketUtils from '../common/market_utils';

let activeMarketHistory = Immutable.OrderedSet();

class ExchangeService {
  /**
   * get Chart Depth
   * @param quoteAssetSymbol
   * @param coreAssetSymbol
   */
  static fetchChartDepthData(quoteAssetSymbol, coreAssetSymbol) {

    return Promise.all([
      Repository.getAsset(quoteAssetSymbol), Repository.getAsset(coreAssetSymbol)
    ]).then(([quoteAsset, baseAsset]) => {
      quoteAsset = quoteAsset.toJS();
      baseAsset = baseAsset.toJS();

      return OrderRepository.fetchLimitOrders(baseAsset.id, quoteAsset.id).then((limitOrders) => {
        let bids = [],
          asks = [],
          totalBids = 0,
          totalAsks = 0,
          parsedOrders = {};
        limitOrders.forEach((order) => {
          Repository._updateObject(order, false, false);

          if (typeof order.for_sale !== 'number') {
            order.for_sale = parseInt(order.for_sale, 10);
          }

          order.expiration = new Date(order.expiration);
          let parseOrder = MarketUtils.parseOrder(order, baseAsset, quoteAsset);
          parsedOrders[order.id] = parseOrder;

          if (order.sell_price.base.asset_id === baseAsset.id) {
            bids.push({
              //price: price,
              //price_full: price.full,
              //price_dec: price.dec,
              //price_int: price.int,
              value: parseOrder.value,
              price: parseOrder.price, //full
              amount: parseOrder.amount,
              //type: "bid",
              sell_price: order.sell_price,
              for_sale: order.for_sale
            });
          }

          if (order.sell_price.base.asset_id !== baseAsset.id) {
            asks.push({
              //price: price,
              //price_full: price.full,
              //price_dec: price.dec,
              //price_int: price.int,
              value: parseOrder.value,
              price: parseOrder.price, //full
              amount: parseOrder.amount,
              //type: "ask",
              sell_price: order.sell_price,
              for_sale: order.for_sale
            });
          }

          bids = bids.sort((a, b) => {
            return a.price - b.price;
          });

          asks = asks.sort((a, b) => {
            return a.price - b.price;
          });

          // Sum bids at same price
          if (bids.length > 1) {
            for (let i = bids.length - 2; i >= 0; i--) {
              if (bids[i].price === bids[i + 1].price) {
                bids[i].amount += bids[i + 1].amount;
                bids[i].value += bids[i + 1].value;
                bids[i].for_sale += bids[i + 1].for_sale;
                bids.splice(i + 1, 1);
              }
            }
          }

          // Sum asks at same price
          if (asks.length > 1) {
            for (let i = asks.length - 2; i >= 0; i--) {
              if (asks[i].price === asks[i + 1].price) {
                asks[i].amount += asks[i + 1].amount;
                asks[i].value += asks[i + 1].value;
                asks[i].for_sale += asks[i + 1].for_sale;
                asks.splice(i + 1, 1);
              }
            }
          }
        });

        let flat_bids = [],
          bidsOrders = [],
          asksOrders = [],
          flat_asks = [],
          power = 1;
        let totalBidValue = 0,
          totalBidForSale = 0;
        bids.reverse().forEach((order) => {
          /**
           * Depth chart bids
           */
          flat_bids.unshift([order.price, order.amount]);

          /**
           * Orders bids
           */

          totalBidForSale += order.value;
          bidsOrders.push({
            value: order.value,
            price: order.price,
            amount: order.amount,
            sell_price: order.sell_price,
            for_sale: order.for_sale,
            totalValue: 0,
            totalForSale: totalBidForSale
          });

          totalBids += order.value;
        });

        bids.forEach((order, idx) => {
          /**
           * Orders bids {totalValue}
           */
          totalBidValue += (order.value);
          bidsOrders[idx]['totalValue'] = totalBidValue;
        });

        let totalAskValue = 0,
          totalAskForSale = 0;

        asks.forEach((order) => {

          /**
           * Depth chart asks
           */
          flat_asks.push([order.price, order.amount]);

          /**
           * Orders asks
           */

          // totalAskValue += (order.price * order.for_sale);
          totalAskValue += (order.value);
          totalAskForSale += order.for_sale;

          // totalAskValue += order.value;
          asksOrders.unshift({
            value: order.value,
            price: order.price,
            amount: order.amount,
            sell_price: order.sell_price,
            for_sale: order.for_sale,
            totalValue: totalAskValue,
            totalForSale: totalAskForSale
          });
        });

        flat_bids = MarketUtils.flatten_orderbookchart_highcharts(flat_bids, true, true, 1000);
        flat_asks = MarketUtils.flatten_orderbookchart_highcharts(flat_asks, true, false, 1000);

        if (flat_bids.length) {
          while ((flat_bids[flat_bids.length - 1][0] * power) < 1) {
            power *= 10;
          }
        } else if (flat_asks.length) {
          while ((flat_asks[0][0] * power) < 1) {
            power *= 10;
          }
        }

        power *= 10;

        if (power !== 1) {
          if (flat_bids.length) {
            flat_bids.forEach((bid) => {
              bid[0] *= power;
            });
          }

          if (flat_asks.length) {
            flat_asks.forEach((ask) => {
              ask[0] *= power;
            });
          }
        }

        if (flat_asks.length > 0) {
          totalAsks = flat_asks[flat_asks.length - 1][1];
        }

        return ExchangeMarketService.getSettlementPrice(baseAsset, quoteAsset)
          .then((settlementPrice) => {
            return {
              bids: flat_bids,
              asks: flat_asks,
              settlementPrice: settlementPrice * power,
              power: power,
              totalBids: totalBids,
              totalAsks: totalAsks,
              openOrders: limitOrders,
              bidsOrders: bidsOrders,
              asksOrders: asksOrders
            };
          });
      });
    });
  }

  /**
   * Get chart data
   *
   * @param quoteAssetSymbol
   * @param coreAssetSymbol
   * @param bucketSize
   */
  static fetchChartData(quoteAssetSymbol, coreAssetSymbol, bucketSize) {
    return AssetRepository.fetchAssetsByIds([quoteAssetSymbol, coreAssetSymbol], true)
      .then((results) => {
        let quoteAsset = results[0],
          baseAsset = results[1];

        if (!quoteAsset || !baseAsset) {
          return false;
        }

        let bucketCount = 200;
        let startDate = new Date();
        let endDate = new Date();

        startDate = new Date(startDate.getTime() - bucketSize * bucketCount * 1000);
        endDate.setDate(endDate.getDate() + 1);

        return Promise.all([
          HistoryRepository.fetchMarketHistory(
            baseAsset.id,
            quoteAsset.id,
            bucketSize,
            startDate.toISOString().slice(0, -5),
            endDate.toISOString().slice(0, -5)
          ).then((result) => {
            return this._priceChart(result, bucketSize, baseAsset, quoteAsset);
          }), HistoryRepository.fetchBuckets()]).then(([priceData, buckets]) => {

          return {
            priceData,
            buckets
          };
        });
      });
  }

  /**
   * Calculate/format chart price
   *
   * @param priceHistory
   * @param bucketSize
   * @param baseAsset
   * @param quoteAsset
   * @returns {{priceData: Array, volumeData: Array, highPriceList: Array}}
   * @private
   */
  static _priceChart(priceHistory, bucketSize, baseAsset, quoteAsset) {
    let volumeData = [];
    let prices = [];
    let highPriceList = [];
    let open, high, low, close, volume;

    for (let i = 0; i < priceHistory.length; i++) {
      let date = new Date(priceHistory[i].key.open + '+00:00').getTime();

      if (quoteAsset.id === priceHistory[i].key.quote) {
        high = utils.get_asset_price(
          priceHistory[i].high_base, baseAsset, priceHistory[i].high_quote, quoteAsset
        );
        low = utils.get_asset_price(
          priceHistory[i].low_base, baseAsset, priceHistory[i].low_quote, quoteAsset
        );
        open = utils.get_asset_price(
          priceHistory[i].open_base, baseAsset, priceHistory[i].open_quote, quoteAsset
        );
        close = utils.get_asset_price(
          priceHistory[i].close_base, baseAsset, priceHistory[i].close_quote, quoteAsset
        );
        volume = utils.get_asset_amount(
          priceHistory[i].quote_volume, quoteAsset
        );
      } else {
        low = utils.get_asset_price(
          priceHistory[i].high_quote, baseAsset, priceHistory[i].high_base, quoteAsset
        );
        high = utils.get_asset_price(
          priceHistory[i].low_quote, baseAsset, priceHistory[i].low_base, quoteAsset
        );
        open = utils.get_asset_price(
          priceHistory[i].open_quote, baseAsset, priceHistory[i].open_base, quoteAsset
        );
        close = utils.get_asset_price(
          priceHistory[i].close_quote, baseAsset, priceHistory[i].close_base, quoteAsset
        );
        volume = utils.get_asset_amount(
          priceHistory[i].base_volume, quoteAsset
        );
      }


      function findMax(a, b) {
        if (a !== Infinity && b !== Infinity) {
          return Math.max(a, b);
        } else if (a === Infinity) {
          return b;
        } else {
          return a;
        }
      }

      function findMin(a, b) {
        if (a !== 0 && b !== 0) {
          return Math.min(a, b);
        } else if (a === 0) {
          return b;
        } else {
          return a;
        }
      }

      if (low === 0) {
        low = findMin(open, close);
      }

      if (isNaN(high) || high === Infinity) {
        high = findMax(open, close);
      }

      if (close === Infinity || close === 0) {
        close = open;
      }

      if (open === Infinity || open === 0) {
        open = close;
      }

      prices.push([date, open, high, low, close]);
      volumeData.push([date, volume]);
      highPriceList.push([date, high]);
    }

    // max buckets returned is 200, if we get less, fill in the gaps starting at the first
    // data point
    let priceLength = prices.length;

    if (priceLength > 0 && priceLength < 200) {
      let now = (new Date()).getTime();
      let firstDate = prices[0][0]; // eslint-disable-line

      // ensure there's a final entry close to the current time
      let i = 1;

      while (prices[0][0] + i * bucketSize * 1000 < now) {
        i++;
      }

      let finalDate = prices[0][0] + (i - 1) * bucketSize * 1000;

      if (prices[priceLength - 1][0] !== finalDate) {
        if (priceLength === 1) {
          prices.push([
            finalDate - bucketSize * 1000, prices[0][4], prices[0][4], prices[0][4], prices[0][4]
          ]);
          prices.push([finalDate, prices[0][4], prices[0][4], prices[0][4], prices[0][4]]);
          volumeData.push([finalDate - bucketSize * 1000, 0]);
          // highPriceList.push([finalDate - bucketSize * 1000, prices[0][4]]);
          // highPriceList.push([finalDate, prices[0][4]]);
          // console.log('SADASDADS', highPriceList); return ;
        } else {
          prices.push([
            finalDate,
            prices[priceLength - 1][4],
            prices[priceLength - 1][4],
            prices[priceLength - 1][4],
            prices[priceLength - 1][4]
          ]);
          // highPriceList.push([finalDate, prices[priceLength - 1][4]]);
        }

        volumeData.push([finalDate, 0]);
      }

      // fill in
      for (let ii = 0; ii < prices.length - 1; ii++) {
        if (prices[ii + 1][0] !== (prices[ii][0] + bucketSize * 1000)) {
          if (prices[ii][0] + bucketSize * 1000 > now) {
            break;
          }

          prices.splice(
            ii + 1,
            0,
            [
              prices[ii][0] + bucketSize * 1000,
              prices[ii][4],
              prices[ii][4],
              prices[ii][4],
              prices[ii][4]
            ]
          );
          volumeData.splice(ii + 1, 0, [prices[ii][0] + bucketSize * 1000, 0]);
          highPriceList.splice(ii + 1, 0, [prices[ii][0] + bucketSize * 1000, prices[ii][4]]);
        }
      }
    }

    return {
      priceData: prices,
      volumeData: volumeData,
      highPriceList: highPriceList
    };
  }

  /**
   * Get tabs stats
   * @param mainAssetSymbol
   * @param topMarkets
   * @param assetsCacheBySymbol
   */
  static fetchTabStats(mainAssetSymbol, topMarkets, assetsCacheBySymbol) {
    let endDate = new Date();
    let startDateShort = new Date();
    endDate.setDate(endDate.getDate() + 1);
    startDateShort = new Date(startDateShort.getTime() - 3600 * 50 * 1000);
    let promises = [];
    let quoteAssetsSymbolIndexes = [];

    topMarkets.forEach((market) => {
      if (
        market !== mainAssetSymbol
        && assetsCacheBySymbol[mainAssetSymbol]
        && assetsCacheBySymbol[market]
      ) {
        quoteAssetsSymbolIndexes.push(market);
        promises.push(Promise.all([
          HistoryRepository.fetchMarketHistory(
            assetsCacheBySymbol[mainAssetSymbol].id,
            assetsCacheBySymbol[market].id,
            3600,
            startDateShort.toISOString().slice(0, -5),
            endDate.toISOString().slice(0, -5)
          ),
          HistoryRepository.fetchFillOrderHistory(
            assetsCacheBySymbol[mainAssetSymbol].id,
            assetsCacheBySymbol[market].id,
            1
          )
        ]));
      }
    });

    let marketRows = [];

    return Promise.all(promises).then((results) => {
      results.forEach((res, idx) => {
        let marketHistoryData = res[0],
          fillOrderHistoryData = res[1];
        let marketSymbol = quoteAssetsSymbolIndexes[idx];
        let calcVolumeAndChange = ExchangeService.calcVolumeAndChange(
          marketHistoryData,
          assetsCacheBySymbol[mainAssetSymbol],
          assetsCacheBySymbol[marketSymbol]
        );
        let assetName = AssetNameHelper.getAssetName(assetsCacheBySymbol[marketSymbol]);
        let finalPrice = 0;

        if (fillOrderHistoryData.length) {
          let priceObject = ExchangeService.getPriceObjectByOrder(
            (fillOrderHistoryData && fillOrderHistoryData.length)
              ? fillOrderHistoryData[0]['op']
              : null,
            assetsCacheBySymbol[mainAssetSymbol],
            assetsCacheBySymbol[marketSymbol]
          );

          if (priceObject.price > 0) {
            finalPrice = priceObject.price;
          }
        }

        //let finalPrice = stats && stats.latestPrice ?
        //    stats.latestPrice :
        //    stats && stats.close && (stats.close.quote.amount && stats.close.base.amount) ?
        //      utils.get_asset_price(
        // stats.close.quote.amount, quote, stats.close.base.amount, base, true) :
        //      utils.get_asset_price(price.base.amount, base, price.quote.amount, quote);

        if (!finalPrice) {
          let price = utils.convertPriceObj(
            assetsCacheBySymbol[marketSymbol], assetsCacheBySymbol[mainAssetSymbol]
          );
          finalPrice = utils.get_asset_price(
            price.base.amount,
            assetsCacheBySymbol[mainAssetSymbol],
            price.quote.amount,
            assetsCacheBySymbol[marketSymbol]);
        }

        let highPrecisionAssets = ['BTC', 'OPEN.BTC', 'TRADE.BTC', 'GOLD', 'SILVER'];
        let precision = 6;

        if (highPrecisionAssets.indexOf(mainAssetSymbol) !== -1) {
          precision = 8;
        }

        marketRows.push({
          'id': marketSymbol + '_' + mainAssetSymbol,
          'assetName': assetName,
          'change': calcVolumeAndChange.change,
          'volumeBase': calcVolumeAndChange.volumeBase,
          'price': finalPrice,
          'priceText': utils.format_number(
            finalPrice, finalPrice > 1000
              ? 0
              : finalPrice > 10
                ? 2
                : precision
          )
        });
      });

      return marketRows;
    });
  }

  /**
   *
   * @param quoteAssetSymbol
   * @param coreAssetSymbol
   */
  static fetchExchangeData(quoteAssetSymbol, coreAssetSymbol) {
    return AssetRepository.fetchAssetsByIds([quoteAssetSymbol, coreAssetSymbol], true)
      .then((results) => {
        let quoteAsset = results[0],
          baseAsset = results[1];

        if (!quoteAsset || !baseAsset) {
          return false;
        }

        //let baseAssetName = AssetNameHelper.getAssetName(baseAsset),
        //    quoteAssetName = AssetNameHelper.getAssetName(quoteAsset);

        let endDate = new Date();
        let startDateShort = new Date();
        startDateShort = new Date(startDateShort.getTime() - 3600 * 50 * 1000);
        endDate.setDate(endDate.getDate() + 1);

        return Promise.all([
          HistoryRepository.fetchMarketHistory(
            baseAsset.id,
            quoteAsset.id,
            3600,
            startDateShort.toISOString().slice(0, -5),
            endDate.toISOString().slice(0, -5)
          ),
          HistoryRepository.fetchFillOrderHistory(baseAsset.id, quoteAsset.id, 200)
        ]).then((results) => {
          let marketHistoryData = results[0],
            fillOrderHistoryData = results[1];
          let calcVolumeAndChange = ExchangeService
            .calcVolumeAndChange(marketHistoryData, baseAsset, quoteAsset);

          activeMarketHistory = activeMarketHistory.clear();
          fillOrderHistoryData.forEach((order) => {
            order.op.time = order.time;
            activeMarketHistory = activeMarketHistory.add(
              order.op
            );
          });

          let latestPriceObject = ExchangeService
            .getLatestChangePriceObject(activeMarketHistory, baseAsset, quoteAsset);

          return {
            latestPrice: latestPriceObject.latestPrice,
            latestPriceText: latestPriceObject.latestPriceText,
            latestPriceChangeType: latestPriceObject.latestPriceChangeType,
            lowBase: calcVolumeAndChange.lowBase,
            highBase: calcVolumeAndChange.highBase,
            change: calcVolumeAndChange.change,
            volumeBase: calcVolumeAndChange.volumeBase,
            volumeQuote: calcVolumeAndChange.volumeQuote,
            marketHistory: activeMarketHistory,
            baseAsset: baseAsset,
            quoteAsset: quoteAsset
          };
        });
      });
  }

  /**
   * Get latest price by history
   *
   * @param activeMarketHistory
   * @param baseAsset
   * @param quoteAsset
   * @returns {{latestPrice: number, latestPriceText: number, latestPriceChangeType: *}}
   */
  static getLatestChangePriceObject(activeMarketHistory, baseAsset, quoteAsset) {
    let changeClass,
      latestPriceFull = 0,
      latestPriceFullText = 0;

    if (activeMarketHistory.size) {
      // Orders come in pairs, first is driver. Third entry is first of second pair.
      let latest_two = activeMarketHistory.take(3);
      let latest = latest_two.first();
      let second_latest = latest_two.last();
      let paysAsset, receivesAsset, isAsk = false;

      if (latest.pays.asset_id === baseAsset.id) {
        paysAsset = baseAsset;
        receivesAsset = quoteAsset;
        isAsk = true;
      } else {
        paysAsset = quoteAsset;
        receivesAsset = baseAsset;
      }

      latestPriceFull = utils.get_asset_price(
        latest.receives.amount, receivesAsset, latest.pays.amount, paysAsset, isAsk
      );

      latestPriceFullText = utils.price_text(latestPriceFull, quoteAsset, baseAsset);

      isAsk = false;

      if (second_latest) {
        if (second_latest.pays.asset_id === baseAsset.id) {
          paysAsset = baseAsset;
          receivesAsset = quoteAsset;
          isAsk = true;
        } else {
          paysAsset = quoteAsset;
          receivesAsset = baseAsset;
        }

        let oldPriceFull = utils.get_asset_price(
          second_latest.receives.amount, receivesAsset, second_latest.pays.amount, paysAsset, isAsk
        );
        changeClass = latestPriceFull === oldPriceFull
          ? ''
          : latestPriceFull - oldPriceFull > 0
            ? 'up'
            : 'down';
      }
    }

    return {
      latestPrice: latestPriceFull,
      latestPriceText: latestPriceFullText,
      latestPriceChangeType: changeClass
    };
  }

  /**
   * Get latest price by order
   * @param order
   * @param baseAsset
   * @param quoteAsset
   * @returns {{price: number}}
   */
  static getPriceObjectByOrder(order, baseAsset, quoteAsset) {
    let latestPriceFull = 0;

    if (order) {
      // Orders come in pairs, first is driver. Third entry is first of second pair.
      let paysAsset, receivesAsset, isAsk = false;

      if (order.pays.asset_id === baseAsset.id) {
        paysAsset = baseAsset;
        receivesAsset = quoteAsset;
        isAsk = true;
      } else {
        paysAsset = quoteAsset;
        receivesAsset = baseAsset;
      }

      latestPriceFull = utils.get_asset_price(
        order.receives.amount, receivesAsset, order.pays.amount, paysAsset, isAsk
      );
      //latestPriceFullText = utils.price_text(latestPriceFull, quoteAsset, baseAsset);
    }

    return {
      price: latestPriceFull
    };
  }

  /**
   * Calculate Volume
   *
   * @param history
   * @param baseAsset
   * @param quoteAsset
   * @returns {{change: string, lowBase: *, highBase: *, volumeBase: *, volumeQuote: *}}
   */
  static calcVolumeAndChange(history, baseAsset, quoteAsset) {
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
      noTrades = true,
      lowBase = 0,
      highBase = 0,
      extremumsIsInited = false;

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

          if (!extremumsIsInited) {
            extremumsIsInited = true;

            if (invert) {
              lowBase = bucket.low_base;
              highBase = bucket.high_base;
            } else {
              lowBase = bucket.low_quote;
              highBase = bucket.high_quote;
            }
          } else {
            if (invert) {
              if (bucket.low_base < lowBase) {
                lowBase = bucket.low_base;
              }

              if (bucket.high_base > highBase) {
                highBase = bucket.high_base;
              }
            } else {
              if (bucket.low_quote < lowBase) {
                lowBase = bucket.low_quote;
              }

              if (bucket.high_quote > highBase) {
                highBase = bucket.high_quote;
              }
            }
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

    return {
      change: change.toFixed(2),
      lowBase: utils.get_asset_amount(lowBase, baseAsset),
      highBase: utils.get_asset_amount(highBase, baseAsset),
      volumeBase: utils.get_asset_amount(volumeBase, baseAsset),
      volumeQuote: utils.get_asset_amount(volumeQuote, quoteAsset)
    };
  }
}

export default ExchangeService;