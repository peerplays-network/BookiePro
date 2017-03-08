import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { browserHistory } from 'react-router';
import { hashHistory } from 'react-router';

import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import localforage from 'localforage';

import { autoRehydrate, persistStore } from 'redux-persist';

export default function configureStore(initialState) {

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

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  persistStore(store, {storage: localforage}, () => {
    console.log('autoRehydrate completed');
  });

  return store;
}
