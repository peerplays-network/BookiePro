import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';
import localforage from 'localforage';
import {composeWithDevTools} from 'redux-devtools-extension';
import {autoRehydrate, persistStore, createTransform} from 'redux-persist-immutable';
import {loadTranslations, setLocale} from 'react-redux-i18n';
import {I18n} from 'react-redux-i18n';
import {translationsObject} from './translations';
import Immutable from 'immutable';
import rootReducer from '../reducers';
import log from 'loglevel';
import * as actionCreators from '../actions/CommonMessageActions';
import {Config} from '../constants';

const syncImmutableTranslationWithStore = (store) => {
  I18n.setTranslationsGetter(() => {
    try {
      return store.getState().getIn(['i18n', 'translations']);
    } catch (e) {
      console.error('Error getting translations from store!');
    }
  });
  I18n.setLocaleGetter(() => {
    try {
      return store.getState().getIn(['i18n', 'locale']);
    } catch (e) {
      console.error('Error getting locale from store!');
    }
  });
};

export default function configureStore() {
  // Define initial state
  const initialState = Immutable.Map();
  let actionsWhitelist;

  if (Config.commonMessageModule.disableActionsInRedux) {
    actionsWhitelist = ['BALANCE_SET_DEPOSIT_ADDRESS'];
  }

  // Configure enhancer for redux dev tools extensions (if available)
  const composeEnhancers = composeWithDevTools({
    features: {
      dispatch: true
    },
    // Option for immutable
    serialize: {immutable: Immutable},
    actionsWhitelist: actionsWhitelist,
    actionCreators: {actionCreators}
  });

  // Construct enhancer
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(hashHistory)),
    autoRehydrate()
  );

  const store = createStore(rootReducer, initialState, enhancer);

  // Configure localforage Indexeddb setting ( for redux-persist)
  localforage.config({
    driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: 'bookie',
    version: 1.0,
    // storeName   : 'store_name', // Should be alphanumeric, with underscores.
    description: 'desc'
  });
  localforage.setDriver(localforage.INDEXEDDB);

  // Create filter to whitelist only subset of the redux store
  const subsetFilterTransform = createTransform(
    (inboundState, key) => {
      if (key === 'rawHistory') {
        // Only persist rawHistoryByAccountId for history reducer
        const savedState = inboundState.filter((v, k) => k === 'rawHistoryByAccountId');
        return savedState;
      } else {
        return inboundState;
      }
    },
    (outboundState) => outboundState
  );

  let persistedStoreWhiteList = ['setting', 'account', 'rawHistory'];
  // Persist store
  persistStore(
    store,
    {
      storage: localforage,
      whitelist: persistedStoreWhiteList,
      transforms: [subsetFilterTransform]
    },
    () => {
      log.debug('Auto Rehydrate completed');
    }
  );

  // Set translation
  syncImmutableTranslationWithStore(store);
  store.dispatch(loadTranslations(translationsObject));
  store.dispatch(setLocale('en'));

  return store;
}
