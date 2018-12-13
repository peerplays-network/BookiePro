import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';
import rootReducer from '../reducers';
// import DevTools from 'containers/DevTools';

import { routerMiddleware, push } from 'react-router-redux'
import {hashHistory} from "react-router";

const middleware = routerMiddleware(hashHistory);

export default function configureStore(preloadedState) {
	const store = createStore(
		rootReducer,
		preloadedState,
		compose(
			applyMiddleware(thunk/*, createLogger()*/, middleware)
		)
	);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers').default;
			store.replaceReducer(nextRootReducer)
		})
	}

	return store;
}
