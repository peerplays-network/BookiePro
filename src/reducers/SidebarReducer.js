import { ActionTypes } from '../constants';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
  complete_tree: [],
  display_tree: null,
  objectId: null,
  level: null,
});

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.SIDEBAR_UPDATE_COMPLETE_TREE: {
      return state.merge({
        complete_tree: action.complete_tree
      });
    }

    default:
      return state;
  }
}
