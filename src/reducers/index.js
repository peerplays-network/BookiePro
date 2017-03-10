import { combineReducers } from 'redux';
import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import RegisterReducer from './RegisterReducer';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'redux-react-i18n'
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  app: AppReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  register: RegisterReducer,
  routing: routerReducer,
  form: formReducer,
  i18n: i18nReducer
});

export default rootReducer;
