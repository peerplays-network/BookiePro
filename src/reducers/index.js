import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import RegisterReducer from './RegisterReducer';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'redux-react-i18n'

const rootReducer = combineReducers({
  app: AppReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  register: RegisterReducer,
  routing: routerReducer,
  i18n: i18nReducer
});

export default rootReducer;
