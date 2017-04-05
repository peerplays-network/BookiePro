import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketGroupsById: {},
  getBettingMarketGroupsByIdsLoadingStatus: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_ADD_BETTING_MARKET_GROUPS: {
      const bettingMarketGroupsById = _.keyBy(action.bettingMarketGroups, bettingMarketGroup => bettingMarketGroup.get('id'));
      return state.merge({
        bettingMarketGroupsById
      });
    }
    case ActionTypes.BETTING_MARKET_GROUP_SET_GET_BETTING_MARKET_GROUPS_BY_IDS_LOADING_STATUS: {
      let getBettingMarketGroupsByIdsLoadingStatus = Immutable.Map();
      action.bettingMarketGroupIds.forEach( id => {
        getBettingMarketGroupsByIdsLoadingStatus = getBettingMarketGroupsByIdsLoadingStatus.set(id, action.loadingStatus);
      })
      return state.merge({
        getBettingMarketGroupsByIdsLoadingStatus
      });
    }
    default:
      return state;
  }
}
