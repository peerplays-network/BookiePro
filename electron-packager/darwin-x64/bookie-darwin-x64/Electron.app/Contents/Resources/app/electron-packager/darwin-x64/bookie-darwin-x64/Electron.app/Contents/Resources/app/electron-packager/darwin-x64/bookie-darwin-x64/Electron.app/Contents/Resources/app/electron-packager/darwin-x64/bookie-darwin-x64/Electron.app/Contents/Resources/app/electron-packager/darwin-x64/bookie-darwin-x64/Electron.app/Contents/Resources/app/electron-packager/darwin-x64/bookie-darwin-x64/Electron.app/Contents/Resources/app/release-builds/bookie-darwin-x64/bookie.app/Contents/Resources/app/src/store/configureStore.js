import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';


const createStoreWithMiddleware = applyMiddleware(thunk, routerMiddleware(browserHistory))(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
}
