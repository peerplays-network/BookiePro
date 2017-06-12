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

class AssetNameHelper {

    static getAssetName(asset, replace = true) {

        let name = asset.symbol;
        let isBitAsset = asset.bitasset;
        let isPredMarket = isBitAsset && asset.bitasset.is_prediction_market;

        let {name: replacedName, prefix} = this.replaceName(name, isBitAsset && !isPredMarket && asset.issuer === "1.2.0");


        if (replace && replacedName !== name) {
            return {
                prefix: prefix,
                name: replacedName
            };
        }

        return {
            prefix: prefix,
            name: name
        };

    }

    static replaceName(name, isBitAsset = false) {
        let toReplace = ["TRADE.", "OPEN.", "METAEX."];
        let suffix = "";
        let i;
        for (i = 0; i < toReplace.length; i++) {
            if (name.indexOf(toReplace[i]) !== -1) {
                name = name.replace(toReplace[i], "") + suffix;
                break;
            }
        }

        return {
            name,
            prefix: isBitAsset ? "bit" : toReplace[i] ? toReplace[i].toLowerCase() : ''
        };
    }

}



export default AssetNameHelper;