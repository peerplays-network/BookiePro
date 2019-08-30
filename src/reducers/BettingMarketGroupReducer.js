import {ActionTypes, Config} from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketGroupsById: {},
  persistedBettingMarketGroupsById: {},
  getBettingMarketGroupsByIdsLoadingStatus: {},
  getBettingMarketGroupsByEventIdsLoadingStatus: {}
});

export default function(state = initialState, action) {
  let newBmgDesc = (bmg) => {
    let description = bmg.get('description');
    let uiaSuffixIndex = description.indexOf('_');

    // Remove the suffix from the description
    return uiaSuffixIndex !== -1
      ? description.slice(0, uiaSuffixIndex)
      : description;
  };

  let newBMGsById = (bmgs) => {
    let bettingMarketGroupsById = Immutable.Map();
    let currency = Config.features.currency;

    bmgs = bmgs.filter((bmg) => {
      let desc = bmg.get('description');
      
      // Retain old data that does not have suffixes.
      if (!desc.includes('_')) {
        return true;
      }

      // Only display data that has a suffix that matches the application display filter.
      return desc.includes(currency);
    });

    bmgs.forEach((bettingMarketGroup) => {
      bettingMarketGroup = bettingMarketGroup.set('description', newBmgDesc(bettingMarketGroup));
      bettingMarketGroupsById = bettingMarketGroupsById.set(
        bettingMarketGroup.get('id'),
        bettingMarketGroup
      );
    });
    return bettingMarketGroupsById;
  };

  switch (action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_ADD_OR_UPDATE_BETTING_MARKET_GROUPS: {
      return state.mergeIn(['bettingMarketGroupsById'], newBMGsById(action.bettingMarketGroups));
    }

    case ActionTypes.BETTING_MARKET_GROUP_ADD_PERSISTED_BETTING_MARKET_GROUPS: {
      return state.mergeIn(['persistedBettingMarketGroupsById'], newBMGsById(action.bettingMarketGroups));
    }

    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketGroupsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach((id) => {
        getBettingMarketGroupsByIdsLoadingStatus = getBettingMarketGroupsByIdsLoadingStatus.set(
          id,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getBettingMarketGroupsByIdsLoadingStatus'],
        getBettingMarketGroupsByIdsLoadingStatus
      );
    }

    case ActionTypes.BETTING_MARKET_GROUP_REMOVE_BETTING_MARKET_GROUPS_BY_IDS: {
      let nextState = state;
      action.bettingMarketGroupIds.forEach((bettingMarketGroupId) => {
        // Since we want to have persistent bmg list
        // Move bettingMarketGroup from bettingMarketGroupsById to persistedBettingMarketGroupsById
        const bettingMarketGroup = state.getIn(['bettingMarketGroupsById', bettingMarketGroupId]);
        nextState = nextState.setIn(
          ['persistedBettingMarketGroupsById', bettingMarketGroupId],
          bettingMarketGroup
        );
        nextState = nextState.deleteIn(['bettingMarketGroupsById', bettingMarketGroupId]);
      });
      return nextState;
    }

    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_EVENT_IDS_LOADING_STATUS: { // eslint-disable-line
      let getBettingMarketGroupsByEventIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach((eventId) => {
        getBettingMarketGroupsByEventIdsLoadingStatus = getBettingMarketGroupsByEventIdsLoadingStatus.set( // eslint-disable-line
          eventId,
          action.loadingStatus
        );
      });
      return state.mergeIn(
        ['getBettingMarketGroupsByEventIdsLoadingStatus'],
        getBettingMarketGroupsByEventIdsLoadingStatus
      );
    }
    
    case ActionTypes.BETTING_MARKET_GROUP_RESET_STORE: {
      return initialState;
    }

    default:
      return state;
  }
}
