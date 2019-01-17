import {
  EXPLORER_FEE_SCHEDULE_SET
} from '../constants/ActionTypes';

/**
 * Explore Fee Schedule Reducer is used to controlling explore/blockchain/fee page
 * Initial State
 * @type {{feeGroups: null}}
 */
let initialState = {
  feeGroups: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    /**
     * blockchain/fee page: set fee groups
     */
    case EXPLORER_FEE_SCHEDULE_SET:
      return {
        feeGroups: action.payload
      };
    default:
      /**
       * We return the previous state in the default case
       */
      return state;
  }
}