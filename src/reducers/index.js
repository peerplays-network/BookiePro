import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import RegisterReducer from './RegisterReducer';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  app: AppReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  register: RegisterReducer,
  routing: routerReducer
});

export default rootReducer;
