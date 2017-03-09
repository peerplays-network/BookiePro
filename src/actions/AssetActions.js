import { ActionTypes } from '../constants';
import { Apis } from 'graphenejs-ws';

const receiveAssetList = (assetList) => {
  return {
    type: ActionTypes.ASSET_RECEIVE_LIST,
    assetList
  }
};

const fetchAssetList = (start, count) => {
  return (dispatch) => {
    // Fetch data from blockchain
    Apis.instance().db_api().exec('list_assets', [start, count])
      .then(assetList => {
        // Store it inside redux
        dispatch(receiveAssetList(assetList));
      });
  }
}

const clearAssetList = () => {
  return receiveAssetList([]);
}

// List variables that you want to expose here
export default {
  fetchAssetList,
  clearAssetList
};
