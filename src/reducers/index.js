import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import RegisterReducer from './RegisterReducer';
import LoginReducer from './LoginReducer';
import SportReducer from './SportReducer';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'react-redux-i18n'
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  app: AppReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  register: RegisterReducer,
  login: LoginReducer,
  sport: SportReducer,
  routing: routerReducer,
  form: formReducer,
  i18n: i18nReducer
});

export default rootReducer;
