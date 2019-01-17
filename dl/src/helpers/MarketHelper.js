import AssetHelper from './AssetHelper';

class MarketHelper {
  //static isMarketAsset(base, quote) {
  //    let isMarketAsset = false, marketAsset, inverted = false;
  //
  //    if (quote.bitasset && base.id === quote.bitasset.options.short_backing_asset) {
  //        isMarketAsset = true;
  //        marketAsset = {id: quote.id}
  //    } else if (base.bitasset && quote.id === base.bitasset.options.short_backing_asset) {
  //        inverted = true;
  //        isMarketAsset = true;
  //        marketAsset = {id: base.id};
  //    }
  //
  //    return {
  //        isMarketAsset,
  //        marketAsset,
  //        inverted
  //    };
  //
  //}

  static parseOrder(order, base, quote, invert = false) {
    let ask = this.isAsk(order, base);
    let quotePrecision = AssetHelper.getAssetPrecision(quote.precision);
    let basePrecision = AssetHelper.getAssetPrecision(base.precision);
    let buy, sell;
    let callPrice;

    if (order.sell_price) {
      buy = ask ? order.sell_price.base : order.sell_price.quote;
      sell = ask ? order.sell_price.quote : order.sell_price.base;
    } else if (order.call_price) {
      buy = order.call_price.base;
      sell = order.call_price.quote;
      let marginPrice = (buy.amount / basePrecision) / (sell.amount / quotePrecision);

      if (!invert) {
        callPrice = marginPrice;
      } else {
        callPrice = 1 / (marginPrice);
      }
    }

    if (typeof sell.amount !== 'number') {
      sell.amount = parseInt(sell.amount, 10);
    }

    if (typeof buy.amount !== 'number') {
      buy.amount = parseInt(buy.amount, 10);
    }


    let fullPrice = callPrice
      ? callPrice
      : (sell.amount / basePrecision) / (buy.amount / quotePrecision);

    fullPrice = Math.round(fullPrice * basePrecision) / basePrecision;

    let amount, value;

    // We need to figure out a better way to set the number of decimals
    // let price_split = utils.format_number(price.full, Math.max(5, pricePrecision)).split(".");
    // price.int = price_split[0];
    // price.dec = price_split[1];
    let price = callPrice
      ? callPrice
      : (sell.amount / basePrecision) / (buy.amount / quotePrecision);

    if (order.debt) {
      if (invert) {
        // Price in USD/BTS, amount should be in BTS, value should be in USD, debt is in USD
        // buy is in USD, sell is in BTS
        // quote is USD, base is BTS
        value = order.debt / quotePrecision;
        amount = this.limitByPrecision(value / fullPrice, base);
      } else {
        // Price in BTS/USD, amount should be in USD, value should be in BTS, debt is in USD
        // buy is in USD, sell is in BTS
        // quote is USD, base is BTS

        amount = this.limitByPrecision(order.debt / quotePrecision, quote);
        value = fullPrice * amount;
      }
    } else if (!ask) {
      amount = this.limitByPrecision(
        (buy.amount / sell.amount) * order.for_sale / quotePrecision, quote
      );
      value = order.for_sale / basePrecision;
    } else {
      amount = this.limitByPrecision(order.for_sale / quotePrecision, quote);
      value = fullPrice * amount;
    }

    value = this.limitByPrecision(value, base);

    if (!ask && order.for_sale) {
      value = this.limitByPrecision(fullPrice * amount, base);
    }

    return {
      amount: amount,
      price: price,
      value: value
    };
  }

  static isAsk(order, base) {
    if (order.sell_price) {
      return order.sell_price.quote.asset_id === base.id;
    } else if (order.call_price) {
      return order.call_price.quote.asset_id === base.id;
    }
  }

  static limitByPrecision(value, asset, floor = true) {
    let assetPrecision = asset.precision;
    let valueString = value.toString();
    let splitString = valueString.split('.');

    if (
      (splitString.length === 1 || splitString.length === 2)
    && splitString[1].length <= assetPrecision
    ) {
      return value;
    }

    let precision = AssetHelper.getAssetPrecision(assetPrecision);
    value = floor
      ? Math.floor(value * precision) / precision
      : Math.round(value * precision) / precision;

    if (isNaN(value) || !isFinite(value)) {
      return 0;
    }

    return value;
  }

  static flatten_orderbookchart_highcharts(array, sumBoolean, inverse) {
    inverse = inverse === undefined ? false : inverse;
    let orderBookArray = [];
    let arrayLength;

    if (inverse) {

      if (array && array.length) {
        arrayLength = array.length - 1;
        orderBookArray.unshift([array[arrayLength][0], array[arrayLength][1]]);

        if (array.length > 1) {
          for (let i = array.length - 2; i >= 0; i--) {
            if (sumBoolean) {
              array[i][1] += array[i + 1][1];
            }

            orderBookArray.unshift([array[i][0], array[i][1]]);
          }
        } else {
          // orderBookArray.unshift([0, array[arrayLength][1]]);
        }
      }
    } else {
      if (array && array.length) {
        orderBookArray.push([array[0][0], array[0][1]]);

        if (array.length > 1) {
          for (var i = 1; i < array.length; i++) {
            if (sumBoolean) {
              array[i][1] += array[i - 1][1];
            }

            orderBookArray.push([array[i][0], array[i][1]]);
          }
        } else {
          // orderBookArray.push([array[0][0] * 1.5, array[0][1]]);
        }
      }
    }

    return orderBookArray;
  }

  //    static getSettlementPrice(base, quote) {
  //        let settlementPrice = 0,
  //            settlement_price;
  //
  //        let {isMarketAsset} = this.isMarketAsset(quote, base);
  //
  //        if (isMarketAsset && quote && base) {
  //            if (
  //   quote.bitasset
  //   && quote.bitasset.current_feed
  //   && base.id === quote.bitasset.options.short_backing_asset
  // ) {
  //                settlement_price = quote.bitasset.current_feed.settlement_price;
  //            } else if (
  // base.bitasset
  // && base.bitassetcurrent_feed
  // && quote.id === base.bitasset.options.short_backing_asset
  // ) {
  //                settlement_price = base.bitasset.current_feed.settlement_price;
  //
  //            }
  //
  //            if (settlement_price) {
  //                let flipped = false;
  //
  //
  //                if (settlement_price.base.asset_id === quote.id) {
  //                    settlementPrice = this.getFeedPrice(settlement_price, flipped);
  //                } else {
  //                    flipped = true;
  //                }
  //            }
  //        }
  //
  //
  //        return settlementPrice;
  //    }

  static getFeedPrice(settlement_price, invert = false) { //TODO
    let price = 0; // eslint-disable-line
    //let quoteAsset = ChainStore.getAsset(settlement_price.getIn(["quote", "asset_id"]));
    //let baseAsset = ChainStore.getAsset(settlement_price.getIn(["base", "asset_id"]));
    //
    //let price = utils.get_asset_price(
    //    settlement_price.getIn(["quote", "amount"]),
    //    quoteAsset,
    //    settlement_price.getIn(["base", "amount"]),
    //    baseAsset
    //)
    //
    //if (invert) {
    //    return 1 / price;
    //} else {
    //    return price;
    //}

    return;
  }

}



export default MarketHelper;