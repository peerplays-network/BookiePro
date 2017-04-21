import { ActionTypes, LoadingStatus } from '../constants';
import { CommunicationService } from '../services';
import Immutable from 'immutable';

/**
 * Private actions
 */
class AssetPrivateActions {

  static setGetAssetsByIdsLoadingStatusAction(assetIds, loadingStatus) {
    return {
      type: ActionTypes.ASSET_SET_GET_ASSETS_BY_IDS_LOADING_STATUS,
      assetIds,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class AssetActions {
  static addOrUpdateAssetsAction(assets) {
    return {
      type: ActionTypes.ASSET_ADD_OR_UPDATE_ASSETS,
      assets
    }
  }

  /**
   * Get assets given their ids (can be immutable array)
   */
  static getAssetsByIds(assetIds) {
    return (dispatch, getState) => {
      let retrievedAssets = Immutable.List();
      let idsOfAssetsToBeRetrieved = Immutable.List();

      // Check if the data is already inside the redux store
      const getAssetsByIdsLoadingStatus = getState().getIn(['asset', 'getAssetsByIdsLoadingStatus']);
      const assetsById = getState().getIn(['asset', 'assetsById']);
      assetIds.forEach((assetId) => {
        if (getAssetsByIdsLoadingStatus.get(assetId) === LoadingStatus.DONE) {
          if (getAssetsByIdsLoadingStatus.has(assetId)) {
            retrievedAssets = retrievedAssets.push(assetsById.get(assetId));
          }
        } else {
          idsOfAssetsToBeRetrieved = idsOfAssetsToBeRetrieved.push(assetId);
        }
      })

      if (idsOfAssetsToBeRetrieved.size === 0) {
        // No assets to be retrieved from blockchain, all data is in blockchain
        return Promise.resolve(retrievedAssets);
      } else {
        // Retrieve data from blockchain
        dispatch(AssetPrivateActions.setGetAssetsByIdsLoadingStatusAction(idsOfAssetsToBeRetrieved, LoadingStatus.LOADING));
        // TODO: mark later
        return CommunicationService.getObjectsByIds(idsOfAssetsToBeRetrieved, true).then((assets) => {
          // Add to redux store
          dispatch(AssetActions.addOrUpdateAssetsAction(assets));
          // Set status
          dispatch(AssetPrivateActions.setGetAssetsByIdsLoadingStatusAction(idsOfAssetsToBeRetrieved, LoadingStatus.DONE));
          // Concat and return
          return retrievedAssets.concat(assets);
        });
      }
    }
  }
}

export default AssetActions;
