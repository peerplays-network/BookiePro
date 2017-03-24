import { ActionTypes } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  lang: "en-us",
  timezone: "UTC+08:00",
  notification: "ON",
  currencyFormat: "BTC"
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SETTING_UPDATE_LANG: {
      return state.merge({
        lang: action.lang
      });
    }
    case ActionTypes.SETTING_UPDATE_TIMEZONE: {
      return state.merge({
        timezone: action.timezone
      });
    }
    case ActionTypes.SETTING_UPDATE_NOTIFICATION: {
      return state.merge({
        notification: action.notification
      });
    }
    case ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT: {
      return state.merge({
        currencyFormat: action.currencyFormat
      });
    }
    default:
      return state;
  }
}
