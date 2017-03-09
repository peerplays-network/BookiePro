
import ActionTypes from '../constants/ActionTypes';
//import { remote } from 'electron'
export function updateSettingLang (lang) {
  return {
    type: ActionTypes.UPDATE_SETTING_LANG,
    lang: lang
  }
}

export function updateSettingTimeZone (timezone) {
  return {
    type: ActionTypes.UPDATE_SETTING_TIMEZONE,
    timezone: timezone
  }
}

export function updateSettingNotification (payload) {
  return {
    type: ActionTypes.UPDATE_SETTING_NOTIFICATION,
    notification: payload
  }
}

export function updateCurrencyFormat (currencyFormat) {
  return {
    type: ActionTypes.UPDATE_SETTING_CURRENCY_FORMAT,
    currencyFormat: currencyFormat
  }
}
