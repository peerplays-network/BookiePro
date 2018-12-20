import {ActionTypes} from '../constants/ActionTypes';

/**
 *
 * Help Reducer is used to controlling a Help popup
 *
 * Initial State
 *
 * showHelpModal - Show/hide popup
 * @type {{showHelpModal: boolean}}
 */
const initialState = {
  showHelpModal: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    /**
     * Toggle Help popup
     */
    case ActionTypes.TOGGLE_HELP_POPUP:
      return {
        ...state,
        showHelpModal: action.payload.showHelpModal
      };
    default:
      /**
       * We return the previous state in the default case
       */
      return state;
  }
};