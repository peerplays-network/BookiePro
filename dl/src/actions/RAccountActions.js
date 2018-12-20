import AccountApi from '../api/accountApi';
import * as Types from '../constants/ActionTypes';
import Immutable from 'immutable';
import {ChainStore} from 'peerplaysjs-lib';
import BalanceRepository from '../repositories/BalanceRepository';
import AssetRepository from '../repositories/AssetRepository';

/**
 * Private Redux Action Creator (ACCOUNT_SEARCH_REQUESTED)
 * set "In process"
 * @param start_symbol
 * @returns {{type, startSymbol: *}}
 */
function action_accountSearchRequested(start_symbol) {
  return {
    type: Types.ACCOUNT_SEARCH_REQUESTED,
    startSymbol: start_symbol
  };
}

/**
 * Private Redux Action Creator (ACCOUNT_SEARCH)
 * start search account
 * @param accounts
 * @param startSymbol
 * @param coreAsset
 * @returns {{type: string, accounts: *, searchTerm: *, coreAsset: *}}
 */
function action_accountSearch(accounts, startSymbol, coreAsset) {
  return {
    type: Types.ACCOUNT_SEARCH,
    accounts: accounts,
    searchTerm: startSymbol,
    coreAsset
  };
}

let accountSearchCache = {};

/**
 * Search account by symbol
 *
 * @param {string} start_symbol
 * @param {number} limit
 * @returns {function(*=)}
 */
export function accountSearch(start_symbol, limit = 50){
  return (dispatch) => {
    let uid = `${start_symbol}_${limit}}`;

    if (!accountSearchCache[uid]) {
      accountSearchCache[uid] = true;
      dispatch(action_accountSearchRequested(start_symbol));

      return AccountApi.lookupAccounts(start_symbol, limit).then((result) => {
        accountSearchCache[uid] = false;
        result = result.filter((a) => {
          return a[0].indexOf(start_symbol) !== -1;
        });
        let accountsBalance = result.map((obj) => BalanceRepository.getAccountBalances(obj[1]));
        Promise.all(accountsBalance).then((balances) => {
          result = result.map((a, index) => {
            a.push(balances[index][0].amount);
            return a;
          });
          AssetRepository.fetchAssetsByIds(['1.3.0']).then((coreAsset) => {
            dispatch(action_accountSearch(result, start_symbol, coreAsset[0]));
          });
        });
      });
    }
  };
}

function getMyAuthorityForAccount(account, recursion_count = 1) {
  return (dispatch) => {
    if (! account) {
      return undefined;
    }

    let owner_authority = account.get('owner');
    let active_authority = account.get('active');
    let owner_pubkey_threshold = dispatch(pubkeyThreshold(owner_authority));

    if (owner_pubkey_threshold === 'full') {
      return 'full';
    }

    let active_pubkey_threshold = dispatch(pubkeyThreshold(active_authority));

    if (active_pubkey_threshold === 'full') {
      return 'full';
    }

    let owner_address_threshold = dispatch(addressThreshold(owner_authority));

    if (owner_address_threshold === 'full') {
      return 'full';
    }

    let active_address_threshold = dispatch(addressThreshold(active_authority));

    if (active_address_threshold === 'full') {
      return 'full';
    }

    let owner_account_threshold, active_account_threshold;

    if (recursion_count < 3) {
      owner_account_threshold = dispatch(accountThreshold(owner_authority, recursion_count));

      if ( owner_account_threshold === undefined ) {
        return undefined;
      }

      if (owner_account_threshold === 'full') {
        return 'full';
      }

      active_account_threshold = dispatch(accountThreshold(active_authority, recursion_count));

      if ( active_account_threshold === undefined ) {
        return undefined;
      }

      if (active_account_threshold === 'full') {
        return 'full';
      }
    }

    if (
      owner_pubkey_threshold === 'partial' || active_pubkey_threshold === 'partial'
      || owner_address_threshold === 'partial' || active_address_threshold === 'partial'
      || owner_account_threshold === 'partial' || active_account_threshold === 'partial'
    ) {
      return 'partial';
    }

    return 'none';
  };
}

function accountThreshold(authority, recursion_count) {
  return (dispatch) => {
    var account_auths = authority.get('account_auths');

    if ( ! account_auths.size ) {
      return 'none';
    }

    let auths = account_auths.map((auth) => {
      let account = ChainStore.getAccount(auth.get(0));

      if (account === undefined) {
        return undefined;
      }

      return dispatch(getMyAuthorityForAccount(account, ++recursion_count));
    });

    let final = auths.reduce((map, auth) => {
      return map.set(auth, true);
    }, Immutable.Map());

    return (
      final.get('full') && final.size === 1
        ? 'full'
        : final.get('partial') && final.size === 1
          ? 'partial'
          : final.get('none') && final.size === 1
            ? 'none'
            : final.get('full') || final.get('partial')
              ? 'partial'
              : undefined
    );
  };
}

function pubkeyThreshold(authority) {
  return (dispatch, getState)=>{
    var available = 0;
    var required = authority.get('weight_threshold');
    var key_auths = authority.get('key_auths');
    let {keys} = getState().privateKey;

    for (let k of key_auths) {
      if (keys.has(k.get(0))) {
        available += k.get(1);
      }

      if (available >= required) {
        break;
      }
    }

    return available >= required
      ? 'full'
      : available > 0
        ? 'partial'
        : 'none';
  };
}

function addressThreshold(authority) {
  return (getState)=>{
    var available = 0;
    var required = authority.get('weight_threshold');
    var address_auths = authority.get('address_auths');

    if ( ! address_auths.size) {
      return 'none';
    }

    var addresses = getState().addressIndex.addresses;

    for (let k of address_auths) {
      var address = k.get(0);
      var pubkey = addresses.get(address);

      if (getState().privateKey.keys.has(pubkey)) {
        available += k.get(1);
      }

      if (available >= required) {
        break;
      }
    }

    return available >= required
      ? 'full'
      : available > 0
        ? 'partial'
        : 'none';
  };
}
