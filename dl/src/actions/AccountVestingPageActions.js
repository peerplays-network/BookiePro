import ActionTypes from '../constants/ActionTypes';
import Repository from 'repositories/chain/repository';
import BalanceRepository from 'repositories/BalanceRepository';
import KeysService from 'services/KeysService';
import TransactionService from 'services/TransactionService';

/**
 * Private Redux Action Creator (SET_ACCOUNT_VESTING_DATA)
 * Set account vesting list
 *
 * @param data
 * @returns {{type, payload: {balances}}}
 */
function setAccountVestingDataAction(data) {
  return {
    type: ActionTypes.SET_ACCOUNT_VESTING_DATA,
    payload: data
  };
}

/**
 * Private Redux Action Creator (RESET_ACCOUNT_VESTING_DATA)
 * Reset page(balance list)
 * @returns {{type, payload: null}}
 */
function resetAccountVestingDataAction() {
  return {
    type: ActionTypes.RESET_ACCOUNT_VESTING_DATA,
    payload: null
  };
}

class AccountVestingPageActions {
  /**
 * Set account vesting list
 *
 * @returns {function(*=, *)}
 */
  static fetchData() {
    return (dispatch, getState) => {
      let state = getState(),
        accountId = state.app.accountId;
      Repository.getAccount(accountId).then((account) => {
        if (
          account && account.get('vesting_balances') && account.get('vesting_balances').size > 0
        ) {
          BalanceRepository.getVestingBalances(accountId).then((balances) => {
            let assetsHashIds = Object.create(null),
              assetsPromises = [];
            balances.forEach((vb) => {
              if (!assetsHashIds[vb.balance.asset_id]) {
                assetsPromises.push(Repository.getAsset(vb.balance.asset_id));
              }
            });

            Promise.all(assetsPromises).then((assets) => {
              let assetsHash = Object.create(null);
              assets.forEach((asset) => {
                if (asset) {
                  assetsHash[asset.get('id')] = asset;
                }
              });
              balances.forEach((vb) => {
                vb.balance.asset = assetsHash[vb.balance.asset_id];
              });

              dispatch(setAccountVestingDataAction({
                balances
              }));
            });
          });
        } else {
          dispatch(resetAccountVestingDataAction());
        }
      });
    };
  }

  /**
 *
 * Claim balances
 *
 * @param {Object} cvb
 * @param {boolean} forceAll
 * @returns {function(*=, *)}
 */
  static claimVestingBalance(cvb, forceAll = false) {
    return (dispatch, getState) => {
      let state = getState(),
        accountId = state.app.accountId;
      KeysService.getActiveKeyFromState(state, dispatch).then(() => {
        TransactionService.claimVestingBalance(accountId, cvb, forceAll, () => {
          dispatch(AccountVestingPageActions.fetchData());
        }).then((trFnc) => {
          dispatch(trFnc);
        });
      });
    };
  }

  /**
     * Reset balances
     *
     * @returns {function(*=, *)}
     */
  static resetAccountVestingData() {
    return (dispatch) => {
      dispatch(resetAccountVestingDataAction());
    };
  }
}

export default AccountVestingPageActions;