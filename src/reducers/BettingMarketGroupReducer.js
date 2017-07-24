import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketGroupsById: {},
  getBettingMarketGroupsByIdsLoadingStatus: {},
  getBettingMarketGroupsByEventIdsLoadingStatus: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_ADD_OR_UPDATE_BETTING_MARKET_GROUPS: {
      let bettingMarketGroupsById = Immutable.Map();
      action.bettingMarketGroups.forEach( bettingMarketGroup => {
        bettingMarketGroupsById = bettingMarketGroupsById.set(bettingMarketGroup.get('id'), bettingMarketGroup);
      })
      return state.mergeIn(['bettingMarketGroupsById'], bettingMarketGroupsById);
    }
    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketGroupsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach( id => {
        getBettingMarketGroupsByIdsLoadingStatus = getBettingMarketGroupsByIdsLoadingStatus.set(id, action.loadingStatus);
      })
      return state.mergeIn(['getBettingMarketGroupsByIdsLoadingStatus'], getBettingMarketGroupsByIdsLoadingStatus);
    }
    case ActionTypes.BETTING_MARKET_GROUP_REMOVE_BETTING_MARKET_GROUPS_BY_IDS: {
      let nextState = state;
      action.bettingMarketGroupIds.forEach((bettingMarketGroupId) => {
        nextState = nextState.deleteIn(['bettingMarketGroupsById', bettingMarketGroupId]);
      });
      return nextState;
    }
    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_EVENT_IDS_LOADING_STATUS: {
      let getBettingMarketGroupsByEventIdsLoadingStatus = Immutable.Map();
      action.eventIds.forEach( eventId => {
        getBettingMarketGroupsByEventIdsLoadingStatus = getBettingMarketGroupsByEventIdsLoadingStatus.set(eventId, action.loadingStatus);
      })
      return state.mergeIn(['getBettingMarketGroupsByEventIdsLoadingStatus'], getBettingMarketGroupsByEventIdsLoadingStatus);
    }

    default:
      return state;
  }
}
