import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  bettingMarketGroupsById: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.BETTING_MARKET_GROUP_ADD_BETTING_MARKET_GROUPS: {
      const bettingMarketGroupsById = _.keyBy(action.bettingMarketGroups, bettingMarketGroup => bettingMarketGroup.get('id'));
      return state.merge({
        bettingMarketGroupsById
      });
    }
    default:
      return state;
  }
}
