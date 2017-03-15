import ActionTypes from '../constants/ActionTypes';

/**
 * Public actions
 */
class SettingActions {
  static updateSettingLang(lang) {
    return {
      type: ActionTypes.SETTING_UPDATE_LANG,
      lang: lang
    }
  }

  static updateSettingTimeZone(timezone) {
    return {
      type: ActionTypes.SETTING_UPDATE_TIMEZONE,
      timezone: timezone
    }
  }

  static updateSettingNotification(payload) {
    return {
      type: ActionTypes.SETTING_UPDATE_NOTIFICATION,
      notification: payload
    }
  }

  static updateCurrencyFormat(currencyFormat) {
    return {
      type: ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT,
      currencyFormat: currencyFormat
    }
  }

}

export default SettingActions;
