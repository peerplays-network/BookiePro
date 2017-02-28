import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  asset: AssetReducer,
  routing: routerReducer
});

export default rootReducer;
