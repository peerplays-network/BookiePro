import {ActionTypes} from '../constants/ActionTypes';
import merge from 'lodash/object/merge';

/**
 * Account Reducer is used to searching accounts
 *
 * Initial State
 *
 * search - search data
 * currentAccount - current account TODO::rm legacy
 *
 * @type {{search: {searchTerm: string, searchAccounts: Array, coreAsset: {}}, accounts: (Immutable.Set<T>|*|Immutable.Set<any>), subbed: boolean, currentAccount: null, linkedAccounts: (Immutable.Set<T>|*|Immutable.Set<any>), ignoredAccounts: (Immutable.Set<T>|*|Immutable.Set<any>), unFollowedAccounts: (Immutable.Set<T>|*|Immutable.Set<any>)}}
 */
const initialState = {
  search: {
    searchTerm: '',
    searchAccounts: [],
    coreAsset: {}
  },
  currentAccount: null,
};

class AccountReducerWrapper {
  static accountSearch(state, payload) {
    state = merge({}, state);
    state.search.searchTerm = payload.searchTerm;
    state.search.searchAccounts = payload.accounts;
    state.search.coreAsset = payload.coreAsset;
    return state;
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    // set "In process" search
    case ActionTypes.ACCOUNT_SEARCH_REQUESTED:
      return state;
      // set search data account
    case ActionTypes.ACCOUNT_SEARCH:
      return AccountReducerWrapper.accountSearch(state, action);
    case ActionTypes.SET_CURRENT_ACCOUNT:
      return Object.assign({}, state, {
        currentAccount: action.payload
      });
      // reset account reducer
    case ActionTypes.ACCOUNT_RESET:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};