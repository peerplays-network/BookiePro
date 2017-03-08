import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'redux-react-i18n'

const rootReducer = combineReducers({
  asset: AssetReducer,
  routing: routerReducer,
  i18n: i18nReducer
});

export default rootReducer;
