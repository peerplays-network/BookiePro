import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { browserHistory } from 'react-router';
import { hashHistory } from 'react-router';

import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import localforage from 'localforage';

import { autoRehydrate, persistStore } from 'redux-persist';

export default function configureStore(initialState) {

  // Configure enhancer
  const enhancer = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(hashHistory)
    ),
    autoRehydrate(),
    // other store enhancers if any,
    window.devToolsExtension ? window.devToolsExtension({
      name: 'MyApp', actionsBlacklist: ['REDUX_STORAGE_SAVE']
    }) : noop => noop
  );

  // Configure localforage Indexeddb setting ( for redux-persist)
  localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'bookie',
    version     : 1.0,
    // storeName   : 'store_name', // Should be alphanumeric, with underscores.
    description : 'desc'
  });
  localforage.setDriver(localforage.INDEXEDDB);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  // persistStore(store, {
  //   storage: localforage,
  //   whitelist: ['setting'] // Only setting wants to be persisted
  // }, () => {
  //   console.log('autoRehydrate completed');
  // });

  return store;
}
