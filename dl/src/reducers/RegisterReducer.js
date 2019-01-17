import RegisterConstants from '../constants/Register';

/**
 *
 * RegisterReducer is used to controlling registration in an application
 *
 * Initial State
 * status - Register form: Button state
 * errors - Common validation errors
 *
 * @type {{status: string, errors: Array}}
 */
let defaultState = {
  status: 'default',
  errors: []
};

export default function (state = defaultState, action) {
  switch (action.type) {
    /**
     * Register form: Setting button state
     */
    case RegisterConstants.REGISTER_SET_STATUS:
      return Object.assign({}, state, {
        status: action.status
      });
      /**
       * Register form: Setting Common validation errors
       */
    case RegisterConstants.REGISTER_SET_ERRORS:
      return Object.assign({}, state, {
        errors: action.errors
      });
    default:
      return state;
  }
}

;