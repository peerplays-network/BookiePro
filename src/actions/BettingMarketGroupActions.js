import { ActionTypes, LoadingStatus } from '../constants';
import Immutable from 'immutable';
import AssetActions from './AssetActions';
import { CommunicationService } from '../services';

class BettingMarketGroupPrivateActions {
  static setGetBettingMarketGroupsByIdsLoadingStatusAction(bettingMarketGroupIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS,
      bettingMarketGroupIds,
      loadingStatus
    }
  }
  static setGetBettingMarketGroupsByEventIdsLoadingStatusAction(eventIds, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_EVENT_IDS_LOADING_STATUS,
      eventIds,
      loadingStatus
    }
  }

}

/**
 * Public actions
 */
class BettingMarketGroupActions {

  static addOrUpdateBettingMarketGroupsAction(bettingMarketGroups) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_ADD_OR_UPDATE_BETTING_MARKET_GROUPS,
      bettingMarketGroups
    }
  }

  static addPersistedBettingMarketGroupsAction(bettingMarketGroups) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_ADD_PERSISTED_BETTING_MARKET_GROUPS,
      bettingMarketGroups
    }
  }

  static removeBettingMarketGroupsByIdsAction(bettingMarketGroupIds) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_REMOVE_BETTING_MARKET_GROUPS_BY_IDS,
      bettingMarketGroupIds
    }
  }

  /**
   * Get betting market groups given their ids (can be immutable array)
   */
  static getBettingMarketGroupsByIds(bettingMarketGroupIds) {
    return (dispatch, getState) => {
      let retrievedBettingMarketGroups = Immutable.List();
      let idsOfBettingMarketGroupsToBeRetrieved = Immutable.List();

      // Check if the data is already inside redux store
      let bettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
      const persistedBettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'persistedBettingMarketGroupsById']);
      bettingMarketGroupsById = bettingMarketGroupsById.concat(persistedBettingMarketGroupsById);
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
        return CommunicationService.getBettingMarketGroupsByIds(idsOfBettingMarketGroupsToBeRetrieved).then((bettingMarketGroups) => {
          // Concat
          retrievedBettingMarketGroups = retrievedBettingMarketGroups.concat(bettingMarketGroups);

          // Check if we have retrieved all bmgs
          if (idsOfBettingMarketGroupsToBeRetrieved.size === bettingMarketGroups.size) {
            // All fetched
            // Add to redux store
            dispatch(BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(bettingMarketGroups));
            // Set status
            dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.DONE));
          } else {
            // Some of them are not fetched, use persistent api to fetch it
            const retrievedBettingMarketGroupIds = bettingMarketGroups.map(bettingMarketGroup => bettingMarketGroup.get('id'));
            const filteredIdsOfBMGsToBeRetrieved = idsOfBettingMarketGroupsToBeRetrieved.filterNot(id => retrievedBettingMarketGroupIds.includes(id));
            return CommunicationService.getPersistedBettingMarketGroupsByIds(filteredIdsOfBMGsToBeRetrieved).then((persistedBMGs) => {
              retrievedBettingMarketGroups = retrievedBettingMarketGroups.concat(persistedBMGs);
              // Add to redux store
              dispatch(BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(bettingMarketGroups));
              dispatch(BettingMarketGroupActions.addPersistedBettingMarketGroupsAction(persistedBMGs));
              // All fetched, set status
              dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(idsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.DONE));
            });
          }
        }).then(() =>  {
          // Get assets related to betting market groups
          const assetIds = retrievedBettingMarketGroups.map( bettingMktGrp => bettingMktGrp.get('asset_id'));
          return dispatch(AssetActions.getAssetsByIds(assetIds));
        }).then(() => {
          // Return retrieved betting market groups
          return retrievedBettingMarketGroups;
        })
      }
    }
  }

  /**
   * Get betting market groups given event ids (can be immutable array)
   */
  static getBettingMarketGroupsByEventIds(eventIds) {
    return (dispatch, getState) => {
      let retrievedBettingMarketGroups = Immutable.List();
      let eventIdsOfBettingMarketGroupsToBeRetrieved = Immutable.List();

      // Get bettingMarketGroupsByEventId
      const bettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
      let bettingMarketGroupsByEventId = Immutable.Map();
      bettingMarketGroupsById.forEach( (bettingMarketGroup, id) => {
        const eventId = bettingMarketGroup.get('event_id');
        bettingMarketGroupsByEventId = bettingMarketGroupsByEventId.update(eventId, bettingMarketGroups => {
          if (!bettingMarketGroups) bettingMarketGroups = Immutable.List();
          return bettingMarketGroups.push(bettingMarketGroup);
        })
      })

      // Check if the requested data is already inside redux store
      const getBettingMarketGroupsByEventIdsLoadingStatus = getState().getIn(['bettingMarketGroup', 'getBettingMarketGroupsByEventIdsLoadingStatus']);
      eventIds.forEach( eventId => {
        if (getBettingMarketGroupsByEventIdsLoadingStatus.get(eventId) === LoadingStatus.DONE) {
          if (bettingMarketGroupsByEventId.has(eventId)) {
            retrievedBettingMarketGroups = retrievedBettingMarketGroups.concat(bettingMarketGroupsByEventId.get(eventId));
          }
        } else {
          eventIdsOfBettingMarketGroupsToBeRetrieved = eventIdsOfBettingMarketGroupsToBeRetrieved.push(eventId);
        }
      })

      if (eventIdsOfBettingMarketGroupsToBeRetrieved.size === 0) {
        // No events to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedBettingMarketGroups);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByEventIdsLoadingStatusAction(eventIdsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getBettingMarketGroupsByEventIds(eventIdsOfBettingMarketGroupsToBeRetrieved).then((events) => {
          // Add data to redux store
          dispatch(BettingMarketGroupActions.addOrUpdateBettingMarketGroupsAction(events));
          // Set status
          dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByEventIdsLoadingStatusAction(eventIdsOfBettingMarketGroupsToBeRetrieved, LoadingStatus.DONE));
          const eventIds = events.map( event => event.get('id'));
          dispatch(BettingMarketGroupPrivateActions.setGetBettingMarketGroupsByIdsLoadingStatusAction(eventIds, LoadingStatus.DONE));
          // Concat with retrieved data from redux store
          return retrievedBettingMarketGroups.concat(events);
        });
      }
    };
  }
}

export default BettingMarketGroupActions;
