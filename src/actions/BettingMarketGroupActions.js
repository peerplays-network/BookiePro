import { ActionTypes } from '../constants';

/**
 * Public actions
 */
class BettingMarketGroupActions {
  static addBettingMarketGroupsAction(bettingMarketGroups) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_ADD_BETTING_MARKET_GROUPS,
      bettingMarketGroups
    }
  }
}

export default BettingMarketGroupActions;
