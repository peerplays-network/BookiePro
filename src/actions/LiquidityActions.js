import { ActionTypes, LoadingStatus } from '../constants';
import { CommunicationService } from '../services';
import Immutable from 'immutable';
import log from 'loglevel';
class LiquidityPrivateActions {
  static setGetTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus(bettingMarketGroupIds, loadingStatus) {
    return {
      type: ActionTypes.LIQUIDITY_SET_GET_TOTAL_MATCHED_BETS_BY_BETTING_MARKET_GROUP_IDS_LOADING_STATUS,
      bettingMarketGroupIds,
      loadingStatus
    }
  }

  static addOrUpdateTotalMatchedBetsByBettingMarketGroupId(totalMatchedBetsByBettingMarketGroupId) {
    return {
      type: ActionTypes.LIQUIDITY_ADD_OR_UPDATE_TOTAL_MATCHED_BETS_BY_BETTING_MARKET_GROUP_ID,
      totalMatchedBetsByBettingMarketGroupId
    }
  }
}

class LiquidityActions {
  /**
   * Get total matched bets for each betting market group, provided the array of betting market group ids (can be immutable)
   * Return a map of total matched bets with betting market group id
   */
  static getTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIds) {
    return (dispatch, getState) => {
      let retrievedTotalMatchedBetsByBettingMarketGroupId = Immutable.Map();
      let bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved = Immutable.List();

      // Check if the requested data is already inside redux store
      const getTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus = getState().getIn(['liquidity', 'getTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus']);
      const totalMatchedBetsByBettingMarketGroupId = getState().getIn(['liquidity', 'totalMatchedBetsByBettingMarketGroupId']);
      bettingMarketGroupIds.forEach( bettingMarketGroupId => {
        if (getTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus.get(bettingMarketGroupId) === LoadingStatus.DONE) {
          if (totalMatchedBetsByBettingMarketGroupId.has(bettingMarketGroupId)) {
            retrievedTotalMatchedBetsByBettingMarketGroupId = retrievedTotalMatchedBetsByBettingMarketGroupId.concat(totalMatchedBetsByBettingMarketGroupId.get(bettingMarketGroupId));
          }
        } else {
          bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved = bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved.push(bettingMarketGroupId);
        }
      })

      if (bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved.size === 0) {
        // No data to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedTotalMatchedBetsByBettingMarketGroupId);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(LiquidityPrivateActions.setGetTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus(bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getTotalMatchedBetsByBettingMarketGroupIds(bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved).then((totalMatchedBetsByBettingMarketGroupId => {
          log.debug('Retrieve total matched bets succeeds', bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved);
          // Save data
          dispatch(LiquidityPrivateActions.addOrUpdateTotalMatchedBetsByBettingMarketGroupId(totalMatchedBetsByBettingMarketGroupId));
          // Set status
          dispatch(LiquidityPrivateActions.setGetTotalMatchedBetsByBettingMarketGroupIdsLoadingStatus(bettingMarketGroupIdsOfTotalMatchedBetsToBeRetrieved, LoadingStatus.DONE));
        }));
      }
    }
  }
}

export default LiquidityActions;
