import utils from 'common/utils';
import Repository from 'repositories/chain/repository';

class ExchangeMarketService {
  /**
   * Get Settlement Price
   *
   * @param base
   * @param quote
   * @returns {Promise}
   */
  static getSettlementPrice(base, quote) {
    return new Promise((resolve) => {
      let settlementPrice = 0,
        settlement_price;

      let {isMarketAsset} = this.isMarketAsset(quote, base);

      if (isMarketAsset && quote && base) {
        if (
          quote.bitasset
          && quote.bitasset.current_feed
          && base.id === quote.bitasset.options.short_backing_asset
        ) {
          settlement_price = quote.bitasset.current_feed.settlement_price;
        } else if (
          base.bitasset
          && base.bitassetcurrent_feed
          && quote.id === base.bitasset.options.short_backing_asset
        ) {
          settlement_price = base.bitasset.current_feed.settlement_price;
        }

        if (settlement_price) {
          let flipped = false;

          if (settlement_price.base.asset_id === quote.id) {

          } else {
            flipped = true;
          }

          return resolve(this.getFeedPrice(settlement_price, flipped));
        }
      }

      return resolve(settlementPrice);
    });
  }

  /**
   * Check - is Market Asset?
   *
   * @param base
   * @param quote
   * @returns {{isMarketAsset: boolean, marketAsset: *, inverted: boolean}}
   */
  static isMarketAsset(base, quote) {
    let isMarketAsset = false,
      marketAsset, inverted = false;

    if (quote.bitasset && base.id === quote.bitasset.options.short_backing_asset) {
      isMarketAsset = true;
      marketAsset = {
        id: quote.id
      };
    } else if (base.bitasset && quote.id === base.bitasset.options.short_backing_asset) {
      inverted = true;
      isMarketAsset = true;
      marketAsset = {
        id: base.id
      };
    }

    return {
      isMarketAsset,
      marketAsset,
      inverted
    };
  }

  /**
   * Get Feed Price
   *
   * @param settlement_price
   * @param invert
   */
  static getFeedPrice(settlement_price, invert = false) {
    return Promise.all([
      Repository.getAsset(settlement_price.quote.asset_id),
      Repository.getAsset(settlement_price.base.asset_id)
    ]).then(([quoteAsset, baseAsset]) => {

      if (!quoteAsset || !baseAsset) {
        return 0;
      }

      quoteAsset = quoteAsset.toJS();
      baseAsset = baseAsset.toJS();

      let price = utils.get_asset_price(
        settlement_price.quote.amount,
        quoteAsset,
        settlement_price.base.amount,
        baseAsset
      );

      if (invert) {
        return 1 / price;
      } else {
        return price;
      }
    });
  }
}

export default ExchangeMarketService;