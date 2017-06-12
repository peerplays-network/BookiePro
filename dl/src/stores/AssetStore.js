/*
 * Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import BaseStore from "./BaseStore";
import Immutable from "immutable";
import alt from "../alt-instance";
import AssetActions from "../actions/AssetActions";
import {Asset} from "./tcomb_structs";
import utils from "../common/utils";


class AssetStore extends BaseStore {
    constructor() {
        super();
        this.assets = Immutable.Map();
        this.asset_symbol_to_id = {};
        this.searchTerms = {};
        this.lookupResults = [];

        this.bindListeners({
            onGetAssetList: AssetActions.getAssetList,
            onGetAsset: AssetActions.getAsset,
            onLookupAsset: AssetActions.lookupAsset
        });
        this._export("getAsset");
    }

    getAsset(id_or_symbol) {
        let id = utils.is_object_id(id_or_symbol) ? id_or_symbol : this.asset_symbol_to_id[id_or_symbol];
        return this.assets.get(id);
    }

    onGetAssetList(payload) {
        if (!payload) {
            return false;
        }
        
        payload.assets.forEach(asset => {

            for (var i = 0; i < payload.dynamic_data.length; i++) {
                if (payload.dynamic_data[i].id === asset.dynamic_asset_data_id) {
                    asset.dynamic_data = payload.dynamic_data[i];
                    break;
                }
            }

            if (asset.bitasset_data_id) {
                asset.market_asset = true;

                for (var i = 0; i < payload.bitasset_data.length; i++) {
                    if (payload.bitasset_data[i].id === asset.bitasset_data_id) {
                        asset.bitasset_data = payload.bitasset_data[i];
                        break;
                    }
                }
            } else {
                asset.market_asset = false;
            }

            this.assets = this.assets.set(
                asset.id,
                Asset(asset)
            );

            this.asset_symbol_to_id[asset.symbol] = asset.id;
        });

    }

    onGetAsset(payload) {
        let {
            asset
        } = payload;

        if (payload.asset === null) {
            this.assets = this.assets.set(
                payload.symbol,
                {notFound: true}
            );
            return true;
        }

        // console.log("onGetAsset payload:", payload);
        asset.dynamic_data = payload.dynamic_data;

        if (payload.bitasset_data) {
            asset.bitasset_data = payload.bitasset_data;
            asset.market_asset = true;
        } else {
            asset.market_asset = false;
        }

        this.assets = this.assets.set(
            asset.id,
            Asset(asset)
        );

        this.asset_symbol_to_id[asset.symbol] = asset.id;
    }

    onLookupAsset(payload) {
        this.searchTerms[payload.searchID] = payload.symbol;
        this.lookupResults = payload.assets;
    }
}

export default alt.createStore(AssetStore, "AssetStore");
