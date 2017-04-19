import { ActionTypes } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  settingByAccountId: {}
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SETTING_SET_INITIAL_SETTING: {
      return state.mergeIn(['settingByAccountId', action.accountId], {
        lang: 'en-us',
        timezone: 'UTC+08:00',
        notification: true,
        currencyFormat: 'BTC',
      })
    }
    case ActionTypes.SETTING_UPDATE_LANG: {
      return state.mergeIn(['settingByAccountId', action.accountId], {
        lang: action.lang,
      })
    }
    case ActionTypes.SETTING_UPDATE_TIMEZONE: {
      return state.mergeIn(['settingByAccountId', action.accountId], {
        timezone: action.timezone,
      })
    }
    case ActionTypes.SETTING_UPDATE_NOTIFICATION: {
      return state.mergeIn(['settingByAccountId', action.accountId], {
        notification: action.notification,
      })
    }
    case ActionTypes.SETTING_UPDATE_CURRENCY_FORMAT: {
      return state.mergeIn(['settingByAccountId', action.accountId], {
        currencyFormat: action.currencyFormat,
      })
    }
    default:
      return state;
  }
}
