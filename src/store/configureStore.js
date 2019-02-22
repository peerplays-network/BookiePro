import {createStore, applyMiddleware} from 'redux';
import Config from '../../config/Config';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {autoRehydrate} from 'redux-persist-immutable';
import rootReducer from '../reducers';
import {hashHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';

let store;
const middleware = routerMiddleware(hashHistory);

function configureStore(preloadedState) {
  let actionsWhitelist;

  //add actions to whitelist in order to see them
  if (
    process.env.NODE_ENV !== 'production' &&
    Config.commonMessageModule.disableActionsInRedux
  ) {
    actionsWhitelist = ['COMMON_MSG_ADD_MSG',
      'COMMON_MSG_REMOVE_MSG'];
  }

  // Configure enhancer for redux dev tools extensions (if available)
  const composeEnhancers = composeWithDevTools({
    features: {
      dispatch: true
    },
    // Option for immutable
    actionsWhitelist: actionsWhitelist,
  });

  // Construct enhancer
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, middleware),
    autoRehydrate()
  );

  const store = createStore(rootReducer, preloadedState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

store = configureStore();

module.exports = store;