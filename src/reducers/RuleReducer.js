import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  rulesById: {},
  getRulesByIdsLoadingStatus: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.RULE_ADD_OR_UPDATE_RULES: {
      let newState = state;
      action.rules.forEach( rule => {
        newState = newState.setIn(['rulesById', rule.get('id')], rule);
      })
      return newState;
    }
    case ActionTypes.RULE_SET_GET_RULES_BY_IDS_LOADING_STATUS: {
      let getRulesByIdsLoadingStatus = Immutable.Map();
      action.ruleIds.forEach( ruleId => {
        getRulesByIdsLoadingStatus = getRulesByIdsLoadingStatus.set(ruleId, action.loadingStatus);
      })
      return state.mergeIn(['getRulesByIdsLoadingStatus'], getRulesByIdsLoadingStatus);
    }
    default:
      return state;
  }
}
