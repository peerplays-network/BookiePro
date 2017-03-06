import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { browserHistory } from 'react-router';
import { hashHistory } from 'react-router';

import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import localforage from 'localforage';

import { autoRehydrate, persistStore } from 'redux-persist';

// const createStoreWithMiddleware = applyMiddleware(thunk, routerMiddleware(hashHistory))(createStore);
// const middleware = applyMiddleware(thunk, routerMiddleware(hashHistory));

export default function configureStore(initialState) {

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    initialState,
    compose(
      applyMiddleware(
        thunk
      ),
      autoRehydrate()
    ),
  );

  // const store = createStoreWithMiddleware(rootReducer,
  //   initialState,
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // );

  persistStore(store, {storage: localforage}, () => {
    console.log('autoRehydrate completed');
  });

  return store;
}
/*

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import localforage from 'localforage';
import * as reducers from '../reducers/index';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  const store = createStore(
    combineReducers({
      ...reducers,
    }),
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware
      ),
      autoRehydrate()
    )
  );
  persistStore(store, {storage: localforage}, () => {
    console.log('autoRehydrate completed');
  });

  return store;
}

*/
