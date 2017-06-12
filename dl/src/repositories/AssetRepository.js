/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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