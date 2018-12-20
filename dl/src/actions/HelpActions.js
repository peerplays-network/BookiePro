import {TOGGLE_HELP_POPUP} from '../constants/ActionTypes';

/**
 * Private Action Creator (TOGGLE_HELP_POPUP)
 *
 * @param isShow
 * @returns {{type, payload: {showHelpModal: boolean}}}
 */
function toggleModalAction(isShow) {
  return {
    type: TOGGLE_HELP_POPUP,
    payload: {
      showHelpModal: isShow
    }
  };
}

class HelpActions {
  /**
 * Toggle Help popup
 *
 * @param {boolean} showHelpModal
 * @returns {function(*=, *)}
 */
  static toggleHelpModal(showHelpModal) {
    return (dispatch) => {
      dispatch(toggleModalAction(showHelpModal));
    };
  }
}

export default HelpActions;