import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import FakeApi from '../communication/FakeApi';

class BettingMarketGroupPrivateActions {
  static setGetBettingMarketGroupsByIdsLoadingStatusAction(bettingMarketGroupIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS,
      bettingMarketGroupIds,
      loadingStatus
    }
  }

}

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

  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    return (dispatch, getState) => {
      bettingMarketGroupIds = Immutable.List().concat(bettingMarketGroupIds);

      let retrievedBettingMarketGroups = Immutable.List();
      let idsOfBettingMarketGroupsToBeRetrieved = Immutable.List();

      // Get eventIdsBySportId
      const bettingMarketGroupByIds = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupByIds']);
      const getBettingMarketGroupsByIdsLoadingStatus = getState().getIn(['bettingMarketGroup', 'getBettingMarketGroupsByIdsLoadingStatus']);
      bettingMarketGroupIds.forEach( (bettingMarketGroupId) => {
        if (getBettingMarketGroupsByIdsLoadingStatus.get(bettingMarketGroupId) === LoadingStatus.DONE) {
          if (bettingMarketGroupByIds.has(bettingMarketGroupId)) {
            retrievedBettingMarketGroups = retrievedBettingMarketGroups.concat(bettingMarketGroupByIds.get(bettingMarketGroupId));
          }  
        } else {
          idsOfBettingMarketGroupsToBeRetrieved = idsOfBettingMarketGroupsToBeRetrieved.push(bettingMarketGroupId);
        }
      })

      if (idsOfBettingMarketGroupsToBeRetrieved.size === 0) {
        // No events to be retrieved
        return Promise.resolve(retrievedBettingMarketGroups);
      } else {
        dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.LOADING));

        // TODO: Replace with actual blockchain call
        return FakeApi.getBettingMarketGroupsByIds(idsOfBettingMarketGroupsToBeRetrieved).then((bettingMarketGroups) => {
          dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
          dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.DONE));
          return retrievedBettingMarketGroups.concat(bettingMarketGroups);
        });
      }
    }
  }
}

export default BettingMarketGroupActions;
