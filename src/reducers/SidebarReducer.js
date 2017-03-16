import { ActionTypes } from '../constants';

let initialState = {
  complete_tree: [],
  display_tree: null,
  objectId: null,
  level: null,
};

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE: {
      return Object.assign({}, state, {
        complete_tree: action.complete_tree,

      });
    }

    default:
      return state;
  }
}
