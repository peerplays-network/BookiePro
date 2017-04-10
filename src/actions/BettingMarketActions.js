import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import { CommunicationService } from '../services';

class BettingMarketPrivateActions {
  static setGetBettingMarketsByIdsLoadingStatusAction(bettingMarketIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_SET_GET_BETTING_MARKETS_BY_IDS_LOADING_STATUS,
      bettingMarketIds,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class BettingMarketActions {

  static addOrUpdateBettingMarketsAction(bettingMarkets) {
    return {
      type: ActionTypes.BETTING_MARKET_ADD_OR_UPDATE_BETTING_MARKETS,
      bettingMarkets
    }
  }

  static removeBettingMarketsByIdsAction(bettingMarketIds) {
    return {
      type: ActionTypes.BETTING_MARKET_REMOVE_BETTING_MARKETS_BY_IDS,
      bettingMarketIds
    }
  }

  /**
   * Get betting markets given array of their ids (can be immutable array)
   */
  static getBettingMarketsByIds(bettingMarketIds) {
    return (dispatch, getState) => {
      let retrievedBettingMarkets = Immutable.List();
      let idsOfBettingMarketsToBeRetrieved = Immutable.List();

      // Check if the data is already inside redux store
      const bettingMarketsById = getState().getIn(['bettingMarket', 'bettingMarketsById']);
      const getBettingMarketsByIdsLoadingStatus = getState().getIn(['bettingMarket', 'getBettingMarketsByIdsLoadingStatus']);
      bettingMarketIds.forEach( (bettingMarketId) => {
        if (getBettingMarketsByIdsLoadingStatus.get(bettingMarketId) === LoadingStatus.DONE) {
          if (bettingMarketsById.has(bettingMarketId)) {
            retrievedBettingMarkets = retrievedBettingMarkets.push(bettingMarketsById.get(bettingMarketId));
          }
        } else {
          idsOfBettingMarketsToBeRetrieved = idsOfBettingMarketsToBeRetrieved.push(bettingMarketId);
        }
      })

      if (idsOfBettingMarketsToBeRetrieved.size === 0) {
        // All data is inside redux store, return it
        return Promise.resolve(retrievedBettingMarkets);
      } else {
        // Some data is in the blockchain, retrieve from blockchain
        // Set status
        dispatch(BettingMarketPrivateActions.setGetBettingMarketsByIdsLoadingStatusAction(idsOfBettingMarketsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getObjectsByIds(idsOfBettingMarketsToBeRetrieved).then((bettingMarkets) => {
          // Add to redux store
          dispatch(BettingMarketActions.addOrUpdateBettingMarketsAction(bettingMarkets));
          // Set status
          dispatch(BettingMarketPrivateActions.setGetBettingMarketsByIdsLoadingStatusAction(idsOfBettingMarketsToBeRetrieved, LoadingStatus.DONE));
          // Concat and return
          return retrievedBettingMarkets.concat(bettingMarkets);
        });
      }
    }
  }
}

export default BettingMarketActions;
