import ActionTypes from '../constants/ActionTypes';
import NavigateActions from '../actions/NavigateActions'

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

  static redirectToChangePwd(){
    return (dispatch) => {
     //Navigate to the 'Change Password' page when 'Change Password' button is clicked
      dispatch(NavigateActions.navigateTo('/change-password'));
    }
  }

}

export default SettingActions;
