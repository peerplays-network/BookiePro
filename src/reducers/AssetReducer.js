import {ActionTypes} from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  assetsById: {},
  getAssetsByIdsLoadingStatus: {}
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ASSET_ADD_OR_UPDATE_ASSETS: {
      let newState = state;
      action.assets.forEach(asset => {
        newState = newState.setIn(['assetsById', asset.get('id')], asset);
      });
      return newState;
    }

    case ActionTypes.ASSET_SET_GET_ASSETS_BY_IDS_LOADING_STATUS: {
      let getAssetsByIdsLoadingStatus = Immutable.Map();
      action.assetIds.forEach(assetId => {
        getAssetsByIdsLoadingStatus = getAssetsByIdsLoadingStatus.set(
          assetId,
          action.loadingStatus
        );
      });
      return state.mergeIn(['getAssetsByIdsLoadingStatus'], getAssetsByIdsLoadingStatus);
    }

    default:
      return state;
  }
}
