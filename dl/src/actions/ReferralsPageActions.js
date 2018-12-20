import {ActionTypes} from '../constants/ActionTypes';
import {ChainStore} from 'peerplaysjs-lib';
import Repository from 'repositories/chain/repository';
import KeysService from 'services/KeysService';
import TransactionService from 'services/TransactionService';

/**
 * Private Redux Action Creator (REFERRALS_SET)
 *
 * Update controlled account
 *
 * @param data
 * @returns {{type, payload: *}}
 */
function setPageDataAction(data) {
  return {
    type: ActionTypes.REFERRALS_SET,
    payload: data
  };
}

let subscribers = {
  referral: null
};

class ReferralsPageActions {
  /**
 * Subscribe to update
 *
 * @returns {function(*=, *=)}
 */
  static subscribe() {
    return (dispatch, getState) => {
      let subscriber = function (dispatch) {
        return () => {
          dispatch(ReferralsPageActions.setPageData());
        };
      };

      subscribers['referral'] = subscriber(dispatch, getState);
      ChainStore.subscribe(subscribers['referral']);
    };
  }

  /**
 *
 * Unsubscribe from chainstore updates
 *
 * @returns {function()}
 */
  static unSubscribe() {
    return () => {
      ChainStore.unsubscribe(subscribers['referral']);
      delete subscribers['referral'];
    };
  }


  /**
 *
 * Update controlled account
 *
 * @returns {function(*, *)}
 */
  static setPageData() {
    return (dispatch, getState) => {
      let state = getState();
      Repository.getAccount(state.app.accountId).then((account) => {
        dispatch(setPageDataAction({
          account: account
        }));
      });
    };
  }

  /**
 * Upgrade account
 *
 * @returns {function(*=, *)}
 */
  static onClickUpgradeLifetime() {
    return (dispatch, getState) => {
      let state = getState();
      KeysService.getActiveKeyFromState(state, dispatch).then(() => {
        TransactionService.upgradeAccount(state.app.accountId, '1.3.0', true, () => {
          dispatch(ReferralsPageActions.setPageData());
        }).then((trFnc) => {
          dispatch(trFnc);
        });
      });
    };
  }
}

export default ReferralsPageActions;