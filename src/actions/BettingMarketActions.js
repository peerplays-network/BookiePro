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
  static setGetBettingMarketsByBettingMarketGroupIdsLoadingStatusAction(bettingMarketGroupIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_SET_GET_BETTING_MARKETS_BY_BETTING_MARKET_GROUP_IDS_LOADING_STATUS,
      bettingMarketGroupIds,
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
   * Get betting market groups given event ids (can be immutable array)
   */
  static getBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIds) {
    return (dispatch, getState) => {
      let retrievedBettingMarkets = Immutable.List();
      let bettingMarketGroupIdsOfBettingMarketsToBeRetrieved = Immutable.List();

      // Get bettingMarketsByBettingMarketGroupId
      const bettingMarketsById = getState().getIn(['bettingMarket', 'bettingMarketsById']);
      let bettingMarketsByBettingMarketGroupId = Immutable.Map();
      bettingMarketsById.forEach( (bettingMarket, id) => {
        const bettingMarketGroupId = bettingMarket.get('event_id');
        bettingMarketsByBettingMarketGroupId = bettingMarketsByBettingMarketGroupId.update(bettingMarketGroupId, bettingMarkets => {
          if (!bettingMarkets) bettingMarkets = Immutable.List();
          return bettingMarkets.push(bettingMarket);
        })
      })

      // Check if the requested data is already inside redux store
      const getBettingMarketsByBettingMarketGroupIdsLoadingStatus = getState().getIn(['bettingMarket', 'getBettingMarketsByBettingMarketGroupIdsLoadingStatus']);
      bettingMarketGroupIds.forEach( bettingMarketGroupId => {
        if (getBettingMarketsByBettingMarketGroupIdsLoadingStatus.get(bettingMarketGroupId) === LoadingStatus.DONE) {
          if (bettingMarketsByBettingMarketGroupId.has(bettingMarketGroupId)) {
            retrievedBettingMarkets = retrievedBettingMarkets.concat(bettingMarketsByBettingMarketGroupId.get(bettingMarketGroupId));
          }
        } else {
          bettingMarketGroupIdsOfBettingMarketsToBeRetrieved = bettingMarketGroupIdsOfBettingMarketsToBeRetrieved.push(bettingMarketGroupId);
        }
      })

      if (bettingMarketGroupIdsOfBettingMarketsToBeRetrieved.size === 0) {
        // No events to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedBettingMarkets);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(BettingMarketPrivateActions.setGetBettingMarketsByBettingMarketGroupIdsLoadingStatusAction(bettingMarketGroupIdsOfBettingMarketsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getBettingMarketsByBettingMarketGroupIds(bettingMarketGroupIdsOfBettingMarketsToBeRetrieved).then((events) => {
          // Add data to redux store
          dispatch(BettingMarketActions.addOrUpdateBettingMarketsAction(events));
          // Set status
          dispatch(BettingMarketPrivateActions.setGetBettingMarketsByBettingMarketGroupIdsLoadingStatusAction(bettingMarketGroupIdsOfBettingMarketsToBeRetrieved, LoadingStatus.DONE));
          const bettingMarketGroupIds = events.map( event => event.get('id'));
          dispatch(BettingMarketPrivateActions.setGetBettingMarketsByIdsLoadingStatusAction(bettingMarketGroupIds, LoadingStatus.DONE));
          // Concat with retrieved data from redux store
          return retrievedBettingMarkets.concat(events);
        });
      }
    };
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
        return CommunicationService.getBettingMarketsByIds(idsOfBettingMarketsToBeRetrieved).then((bettingMarkets) => {
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
