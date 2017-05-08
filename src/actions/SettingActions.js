import ActionTypes from '../constants/ActionTypes';
import NavigateActions from '../actions/NavigateActions'

/**
 * Private actions
 */
class SettingPrivateActions {
  static updateSettingLangAction(lang, accountId) {
    return {
      type: ActionTypes.SETTING_UPDATE_LANG,
      lang,
      accountId
    }
  }

  static updateSettingTimeZoneAction(timezone, accountId) {
    return {
      type: ActionTypes.SETTING_UPDATE_TIMEZONE,
      timezone,
      accountId
    }
  }

  static updateSettingNotificationAction(notification, accountId) {
    return {
      type: ActionTypes.SETTING_UPDATE_NOTIFICATION,
      notification,
      accountId
    }
  }

  static updateCurrencyFormatAction(currencyFormat, accountId) {
    return {
      type: ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT,
      currencyFormat,
      accountId
    }
  }

  static setInitialSettingAction(accountId) {
    return {
      type: ActionTypes.SETTING_SET_INITIAL_SETTING,
      accountId
    }
  }

}
/**
 * Public actions
 */
class SettingActions {
  /**
   * Set initial setting for an account if it has never been set before
   */
  static setInitialSetting() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        const settingByAccountId = getState().getIn(['setting', 'settingByAccountId']);
        const hasNeverSetInitialSetting = !settingByAccountId.has(accountId);
        if (hasNeverSetInitialSetting) {
          dispatch(SettingPrivateActions.setInitialSettingAction(accountId));
        }
      }
    }
  }

  static updateSettingLang(lang) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        dispatch(SettingPrivateActions.updateSettingLangAction(lang, accountId));
      }
    }
  }

  static updateSettingTimeZone(timezone) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        dispatch(SettingPrivateActions.updateSettingTimeZoneAction(timezone, accountId));
      }
    }
  }

  static updateSettingNotification(notification) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        dispatch(SettingPrivateActions.updateSettingNotificationAction(notification, accountId));
      }
    }
  }

  static updateCurrencyFormat(currencyFormat) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        dispatch(SettingPrivateActions.updateCurrencyFormatAction(currencyFormat, accountId));
      }
    }
  }
  /**
   * Mark skip logout popup next time for this account
   */
  static markSkipLogoutPopupAction(accountId, isSkipLogoutPopup) {
    return {
      type: ActionTypes.SETTING_MARK_SKIP_LOGOUT_POPUP,
      accountId,
      isSkipLogoutPopup
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
