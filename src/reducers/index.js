import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  asset: AssetReducer,
  setting: SettingReducer,
  routing: routerReducer
});

export default rootReducer;
