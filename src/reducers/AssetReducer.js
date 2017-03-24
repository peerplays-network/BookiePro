import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  assetList: []
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ASSET_RECEIVE_LIST: {
      return state.merge({
        assetList: action.assetList
      });
    }
    default:
      return state;
  }
}
