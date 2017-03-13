
import ActionTypes from '../constants/ActionTypes';
//import { remote } from 'electron'
export function updateSettingLang (lang) {
  return {
    type: ActionTypes.SETTING_UPDATE_LANG,
    lang: lang
  }
}

export function updateSettingTimeZone (timezone) {
  return {
    type: ActionTypes.SETTING_UPDATE_TIMEZONE,
    timezone: timezone
  }
}

export function updateSettingNotification (payload) {
  return {
    type: ActionTypes.SETTING_UPDATE_NOTIFICATION,
    notification: payload
  }
}

export function updateCurrencyFormat (currencyFormat) {
  return {
    type: ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT,
    currencyFormat: currencyFormat
  }
}
