import { ActionTypes, LoadingStatus} from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  assetsById: {},
  loadingStatus: LoadingStatus.DEFAULT
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ASSET_ADD_ASSETS: {
      let assetsById = state.assetById;
      action.assets.forEach((asset) => {
        const id = asset.get('id');
        assetsById = assetsById.set(id, asset);
      })
      return state.merge({
        assetsById
      });
    }
    case ActionTypes.ASSET_SET_GET_ASSETS_LOADING_STATUS: {
      return state.merge({
        loadingStatus: action.loadingStatus
      })
    }
    default:
      return state;
  }
}
