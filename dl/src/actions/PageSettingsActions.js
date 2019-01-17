import {ADD_CONNECTION, REMOVE_CONNECTION} from '../constants/ActionTypes';
import {getViewSettings,setViewSettings} from 'services/ViewSettingsService';

/**
 * Settings page Action Creator (ADD_CONNECTION)
 * Add WS connection
 * @param data
 * @returns {Function}
 */
export function addConnection(data){
  let connection = getViewSettings('connection');
  setViewSettings({connection : connection.concat(data)});

  return function (dispatch) {
    dispatch({
      type: ADD_CONNECTION,
      payload: data
    });
  };
}

/**
 * Settings page Action Creator (REMOVE_CONNECTION)
 * Remove WS connection
 * @param data
 * @returns {Function}
 */
export function removeConnection(data) {
  let connection = getViewSettings('connection');
  setViewSettings({connection : connection.filter((item) => item !== data)});

  return function (dispatch) {
    dispatch({
      type: REMOVE_CONNECTION,
      payload: data
    });
  };
}