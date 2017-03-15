import { ActionTypes } from '../constants';
import { Apis } from 'graphenejs-ws';

/**
 * Private actions
 */
class AssetPrivateActions {
  static setAssetListAction(assetList) {
    return {
      type: ActionTypes.ASSET_RECEIVE_LIST,
      assetList
    }
  };
}

/**
 * Public actions
 */
class AssetActions {
  static fetchAssetList(start, count) {
    return (dispatch) => {
      // Fetch data from blockchain
      Apis.instance().db_api().exec('list_assets', [start, count])
        .then(assetList => {
          // Store it inside redux
          dispatch(AssetPrivateActions.setAssetListAction(assetList));
        });
    }
  }

  static clearAssetList() {
    return AssetPrivateActions.setAssetListAction([]);
  }
}


// List variables that you want to expose here
export default AssetActions;
