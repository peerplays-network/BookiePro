import { ActionTypes } from '../constants';

/**
 * Public actions
 */
class BettingMarketActions {
  static addBettingMarketsAction(bettingMarkets) {
    return {
      type: ActionTypes.BETTING_MARKET_ADD_BETTING_MARKETS,
      bettingMarkets
    }
  }
}

export default BettingMarketActions;
