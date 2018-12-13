import {Apis} from "peerplaysjs-ws";
import ObjectRepository from "./ObjectRepository"

class AssetRepository {
    static fetchAssetsByIds(ids = [], withBitAssets = false) {

        return Apis.instance().db_api().exec("lookup_asset_symbols", [ids]).then(function (asset_objects) {


            if (withBitAssets) {

                let bitAssetIds = [];

                asset_objects.forEach((asset) => {

                    if (asset && asset.bitasset_data_id) {
                        bitAssetIds.push(asset.bitasset_data_id);
                    }

                });

                if (bitAssetIds.length > 0) {

                    return ObjectRepository.fetchObjectsByIds(bitAssetIds).then((bitassets) => {


                        let bitAssetsHash = {};

                        bitassets.forEach((bitasset) => {
                            bitAssetsHash[bitasset.id] = bitasset;
                        });

                        asset_objects.forEach((asset) => {

                            if (asset && asset.bitasset_data_id && bitAssetsHash[asset.bitasset_data_id]) {
                                asset.bitasset = bitAssetsHash[asset.bitasset_data_id];
                            }

                        });

                        return asset_objects;

                    });
                }
            }


            return asset_objects;

        }).catch(function (error) {
            console.log('AssetRepository', error);
        });
    }
}

export default AssetRepository;