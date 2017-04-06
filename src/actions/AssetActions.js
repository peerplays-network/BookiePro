import { ActionTypes, LoadingStatus } from '../constants';
import { CommunicationService } from '../services';

/**
 * Private actions
 */
class AssetPrivateActions {

  static setGetAssetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.ASSET_SET_GET_ASSETS_LOADING_STATUS,
      loadingStatus
    }
  }
  static addAssetsAction(assets) {
    return {
      type: ActionTypes.ASSET_ADD_ASSETS,
      assets
    }
  }

}

/**
 * Public actions
 */
class AssetActions {

  static getAssets(assetIds) {
    return (dispatch) => {
      dispatch(AssetPrivateActions.setGetAssetsLoadingStatusAction(LoadingStatus.LOADING));
      return CommunicationService.getAssets.then((assets) => {
        // Set asset
        dispatch(AssetPrivateActions.addAssetsAction(assets));
        dispatch(AssetPrivateActions.setGetAssetsLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        dispatch(AssetPrivateActions.setGetAssetsLoadingStatusAction(LoadingStatus.ERROR));
        throw error;
      });
    }
  }
}


// List variables that you want to expose here
export default AssetActions;
