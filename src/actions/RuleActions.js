import { ActionTypes, LoadingStatus } from '../constants';
import { CommunicationService } from '../services';
import Immutable from 'immutable';

/**
 * Private actions
 */
class RulePrivateActions {

  static setGetRulesByIdsLoadingStatusAction(ruleIds, loadingStatus) {
    return {
      type: ActionTypes.RULE_SET_GET_RULES_BY_IDS_LOADING_STATUS,
      ruleIds,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class RuleActions {
  static addOrUpdateRulesAction(rules) {
    return {
      type: ActionTypes.RULE_ADD_OR_UPDATE_RULES,
      rules
    }
  }

  /**
   * Get assets given their ids (can be immutable array)
   */
  static getRulesByIds(ruleIds) {
    return (dispatch, getState) => {
      let retrievedRules = Immutable.List();
      let idsOfRulesToBeRetrieved = Immutable.List();

      // Check if the data is already inside the redux store
      const getRulesByIdsLoadingStatus = getState().getIn(['rule', 'getRulesByIdsLoadingStatus']);
      const assetsById = getState().getIn(['rule', 'rulesById']);
      ruleIds.forEach((ruleId) => {
        if (getRulesByIdsLoadingStatus.get(ruleId) === LoadingStatus.DONE) {
          if (getRulesByIdsLoadingStatus.has(ruleId)) {
            retrievedRules = retrievedRules.push(assetsById.get(ruleId));
          }
        } else {
          idsOfRulesToBeRetrieved = idsOfRulesToBeRetrieved.push(ruleId);
        }
      })

      if (idsOfRulesToBeRetrieved.size === 0) {
        // No assets to be retrieved from blockchain, all data is in blockchain
        return Promise.resolve(retrievedRules);
      } else {
        // Retrieve data from blockchain
        dispatch(RulePrivateActions.setGetRulesByIdsLoadingStatusAction(idsOfRulesToBeRetrieved, LoadingStatus.LOADING));
        // TODO: mark later
        return CommunicationService.getRulesByIds(idsOfRulesToBeRetrieved).then((rules) => {
          // Add to redux store
          dispatch(RuleActions.addOrUpdateRulesAction(rules));
          // Set status
          dispatch(RulePrivateActions.setGetRulesByIdsLoadingStatusAction(idsOfRulesToBeRetrieved, LoadingStatus.DONE));
          // Concat and return
          return retrievedRules.concat(rules);
        });
      }
    }
  }
}

export default RuleActions;
