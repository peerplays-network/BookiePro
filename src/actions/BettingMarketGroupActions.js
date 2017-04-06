import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import { CommunicationService } from '../services';

class BettingMarketGroupPrivateActions {
  static setGetBettingMarketGroupsByIdsLoadingStatusAction(bettingMarketGroupIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS,
      bettingMarketGroupIds,
      loadingStatus
    }
  }
  static addBettingMarketGroupsAction(bettingMarketGroups) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_ADD_BETTING_MARKET_GROUPS,
      bettingMarketGroups
    }
  }
}

/**
 * Public actions
 */
class BettingMarketGroupActions {

  /**
   * Get betting market groups given their ids (can be immutable array)
   */
  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    return (dispatch, getState) => {
      let retrievedBettingMarketGroups = Immutable.List();
      let idsOfBettingMarketGroupsToBeRetrieved = Immutable.List();

      // Check if the data is already inside redux store
      const bettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
      const getBettingMarketGroupsByIdsLoadingStatus = getState().getIn(['bettingMarketGroup', 'getBettingMarketGroupsByIdsLoadingStatus']);
      bettingMarketGroupIds.forEach( (bettingMarketGroupId) => {
        if (getBettingMarketGroupsByIdsLoadingStatus.get(bettingMarketGroupId) === LoadingStatus.DONE) {
          if (bettingMarketGroupsById.has(bettingMarketGroupId)) {
            retrievedBettingMarketGroups = retrievedBettingMarketGroups.push(bettingMarketGroupsById.get(bettingMarketGroupId));
          }
        } else {
          idsOfBettingMarketGroupsToBeRetrieved = idsOfBettingMarketGroupsToBeRetrieved.push(bettingMarketGroupId);
        }
      })

      if (idsOfBettingMarketGroupsToBeRetrieved.size === 0) {
        // All data is inside redux store, return it
        return Promise.resolve(retrievedBettingMarketGroups);
      } else {
        // Some data is in the blockchain, retrieve from blockchain
        // Set status
        dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getObjectsByIds(idsOfBettingMarketGroupsToBeRetrieved).then((bettingMarketGroups) => {
          // Add to redux store
          dispatch(BettingMarketGroupPrivateActions.addBettingMarketGroupsAction(bettingMarketGroups));
          // Set status
          dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.DONE));
          // Concat and return
          return retrievedBettingMarketGroups.concat(bettingMarketGroups);
        });
      }
    }
  }
}

export default BettingMarketGroupActions;
