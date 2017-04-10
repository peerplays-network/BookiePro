import { ActionTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  assetsById: {},
  getAssetsByIdsLoadingStatus: {},
});

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ASSET_ADD_ASSETS: {
      let assetsById = Immutable.Map();
      action.assets.forEach( asset => {
        assetsById = assetsById.set(asset.get('id'), asset);
      })
      return state.mergeIn(['assetsById'], assetsById);
    }
    case ActionTypes.ASSET_SET_GET_ASSETS_BY_IDS_LOADING_STATUS: {
      let getAssetsByIdsLoadingStatus = Immutable.Map();
      action.assetIds.forEach( assetId => {
        getAssetsByIdsLoadingStatus = getAssetsByIdsLoadingStatus.set(assetId, action.loadingStatus);
      })
      return state.mergeIn(['getAssetsByIdsLoadingStatus'], getAssetsByIdsLoadingStatus);
    }
    default:
      return state;
  }
}
