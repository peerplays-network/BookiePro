import * as types from '../constants/ActionTypes';

const initialState = {
  assetList: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case types.RECEIVE_ASSET_LIST: {
      const assetList = action.assetList;
      return Object.assign({}, state, { assetList });
    }
    default:
      return state;
  }
}
