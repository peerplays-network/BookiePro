import * as types from '../constants/ActionTypes';

const initialState = {
  lang: "en-us",
  timezone: "UTC+08:00",
  notification: "ON",
  currencyFormat: "BTC"
};
/*

export const UPDATE_SETTING_LANG = 'UPDATE_SETTING_LANG';
export const UPDATE_SETTING_TIMEZONE = 'UPDATE_SETTING_TIMEZONE';
export const UPDATE_SETTING_NOTIFICATION = 'UPDATE_SETTING_NOTIFICATION';
export const UPDATE_SETTING_CURRENCY_FORMAT = 'UPDATE_SETTING_CURRENCY_FORMAT';
*/
export default function (state = initialState, action) {
  switch(action.type) {

    case types.UPDATE_SETTING_LANG:
      return Object.assign({}, state, {
        lang: action.lang,
      });

    case types.UPDATE_SETTING_TIMEZONE:
      return Object.assign({}, state, {
        timezone: action.timezone,
      });

    case types.UPDATE_SETTING_NOTIFICATION:
      // return action.notification;
      return Object.assign({}, state, {
        notification: action.notification,
      });

    case types.UPDATE_SETTING_CURRENCY_FORMAT:
      return Object.assign({}, state, {
        currencyFormat: action.currencyFormat,
      });

    default:
      return state;
  }
}
