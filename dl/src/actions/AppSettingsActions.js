import {ActionTypes} from '../constants/ActionTypes';
import SettingsStorageService from '../services/SettingsStorageService';

class AppSettingsActions {
  /**
 * Switch App locale
 * TODO::
 * @param locale
 * @returns {function(*)}
 */
  static switchLocale(locale) { // eslint-disable-line
    return (dispatch) => { // eslint-disable-line
      //TODO::
    };
  }

  /**
 * Change WS connection
 *
 * @param connection
 * @returns {function(*)}
 */
  static changeConnection(connection) {
    return (dispatch) => {
      SettingsStorageService.set('connection',  connection);
      dispatch({
        type: ActionTypes.CHANGE_CONNECTION,
        payload: connection
      });
      SettingsStorageService.set('changeConnection',  1);
      window.location.reload();
    };
  }
}

export default AppSettingsActions;