import {
    CHANGE_CONNECTION
} from '../constants/ActionTypes';

import SettingsStorageService from '../services/SettingsStorageService';

class AppSettingsActions {

    /**
     * Switch App locale
     * TODO::
     * @param locale
     * @returns {function(*)}
     */
    static switchLocale(locale) {
        return dispatch => {
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
                type: CHANGE_CONNECTION,
                payload: connection
            });

            SettingsStorageService.set('changeConnection',  1);

            window.location.reload();

        };
    }

}

export default AppSettingsActions;