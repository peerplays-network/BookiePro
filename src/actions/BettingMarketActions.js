import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import FakeApi from '../communication/FakeApi';

class BettingMarketPrivateActions {
  static setGetBettingMarketsByIdsLoadingStatusAction(bettingMarketIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_SET_GET_BETTING_MARKET_BY_IDS_LOADING_STATUS,
      bettingMarketIds,
      loadingStatus
    }
  }
}

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

  static getBettingMarketsByIds(bettingMarketIds) {
    return (dispatch, getState) => {
      bettingMarketIds = Immutable.List().concat(bettingMarketIds);

      let retrievedBettingMarkets = Immutable.List();
      let idsOfBettingMarketsToBeRetrieved = Immutable.List();

      // Get eventIdsBySportId
      const bettingMarketByIds = getState().getIn(['bettingMarket', 'bettingMarketByIds']);
      const getBettingMarketsByIdsLoadingStatus = getState().getIn(['bettingMarket', 'getBettingMarketsByIdsLoadingStatus']);
      bettingMarketIds.forEach( (bettingMarketId) => {
        if (getBettingMarketsByIdsLoadingStatus.get(bettingMarketId) === LoadingStatus.DONE) {
          if (bettingMarketByIds.has(bettingMarketId)) {
            retrievedBettingMarkets = retrievedBettingMarkets.concat(bettingMarketByIds.get(bettingMarketId));
          }
        } else {
          idsOfBettingMarketsToBeRetrieved = idsOfBettingMarketsToBeRetrieved.push(bettingMarketId);
        }
      })

      if (idsOfBettingMarketsToBeRetrieved.size === 0) {
        // No events to be retrieved
        return Promise.resolve(retrievedBettingMarkets);
      } else {
        dispatch(BettingMarketPrivateActions.setGetBettingMarketsByIdsLoadingStatusAction(idsOfBettingMarketsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getBettingMarketsByIds(idsOfBettingMarketsToBeRetrieved).then((bettingMarkets) => {
          dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));
          dispatch(BettingMarketPrivateActions.setGetBettingMarketsByIdsLoadingStatusAction(idsOfBettingMarketsToBeRetrieved, LoadingStatus.DONE));
          return retrievedBettingMarkets.concat(bettingMarkets);
        });
      }
    }
  }
}

export default BettingMarketActions;
