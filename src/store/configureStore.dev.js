import {createStore, applyMiddleware, compose} from 'redux';
import Config from '../../config/Config';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {autoRehydrate} from 'redux-persist-immutable';
import rootReducer from '../reducers';
// import DevTools from 'containers/DevTools';
import {hashHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';
//import * as actionCreators from '../actions/CommonMessageActions';

const middleware = routerMiddleware(hashHistory);

export default function configureStore(preloadedState) {

  let actionsWhitelist;

  if (Config.commonMessageModule.disableActionsInRedux) {
    actionsWhitelist = ['COMMON_MSG_ADD_MSG'];//add actions to whitelist in order to see them
  }

  // Configure enhancer for redux dev tools extensions (if available)
  const composeEnhancers = composeWithDevTools({
    features: {
      dispatch: true
    },
    // Option for immutable
    //serialize: {immutable: Immutable},
    actionsWhitelist: actionsWhitelist,
    //actionCreators: {actionCreators}
  });

  // Construct enhancer
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(hashHistory)),
    autoRehydrate()
  );

  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer,
    compose(
      applyMiddleware(thunk/*, createLogger()*/, middleware),
      //DevTools.instrument(),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
