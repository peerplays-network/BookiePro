import ActionTypes from '../constants/ActionTypes';

class HelpPrivateActions {
  /**
   * Private Action Creator (TOGGLE_HELP_POPUP)
   *
   * @param isShow
   * @returns {{type, payload: {showHelpModal: boolean}}}
   */
  static toggleModalAction(isShow) {
    return {
      type: ActionTypes.TOGGLE_HELP_POPUP,
      payload: {
        showHelpModal: isShow
      }
    };
  }
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
      dispatch(HelpPrivateActions.toggleModalAction(showHelpModal));
    };
  }
}

export default HelpActions;