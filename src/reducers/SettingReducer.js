import { ActionTypes } from '../constants';

const initialState = {
  lang: "en-us",
  timezone: "UTC+08:00",
  notification: "ON",
  currencyFormat: "BTC"
};

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.SETTING_UPDATE_LANG:
      return Object.assign({}, state, {
        lang: action.lang,
      });

    case ActionTypes.SETTING_UPDATE_TIMEZONE:
      return Object.assign({}, state, {
        timezone: action.timezone,
      });

    case ActionTypes.SETTING_UPDATE_NOTIFICATION:
      // return action.notification;
      return Object.assign({}, state, {
        notification: action.notification,
      });

    case ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT:
      return Object.assign({}, state, {
        currencyFormat: action.currencyFormat,
      });

    default:
      return state;
  }
}
