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

import utils from "common/utils";
import Immutable from "immutable";
var {object_type} = require("peerplaysjs-lib").ChainTypes;

function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location) {
        componentName = componentName || ANONYMOUS;
        if (props[propName] == null) {
            if (isRequired) {
                return new Error(
                    ("Required " + location + " `" + propName + "` was not specified in ") +
                    ("`" + componentName + "`.")
                );
            }
            return null;
        } else {
            return validate(props, propName, componentName, location);
        }
    }

    let chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
}

function objectIdChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (typeof value === "string") {
            return utils.is_object_id(value) ? null : new Error(`${propName} in ${componentName} should be an object id`);
        } else if (typeof value === "object") {
            // TODO: check object type (probably we should require an object to be a tcomb structure)
        } else {
            return new Error(`${propName} in ${componentName} should be an object id or object`);
        }
    }
    // assume all ok
    return null;
}

function keyChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (typeof value === "string") {
            // TODO: check if it's valid key
            // PublicKey.fromPublicKeyString(value)
            return null;
        } else {
            return new Error(`${propName} in ${componentName} should be a key string`);
        }
    }
    // assume all ok
    return null;
}

function assetChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (typeof value === "string") {
            return null;
        } else if (typeof value === "object") {
            // TODO: check object type (probably we should require an object to be a tcomb structure)
        } else {
            return new Error(`${propName} of ${value} in ${componentName} should be an asset symbol or id`);
        }
    }
    // assume all ok
    return null;
}

function accountChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (typeof value === "string") {
            if (utils.is_object_id(value) && value.split(".")[1] === object_type.account) {
                return null;
            } else {
                return new Error(`${propName} of ${value} in ${componentName} should be an account id`);
            }
        } else if (typeof value === "object") {
            // TODO: check object type (probably we should require an object to be a tcomb structure)
        } else {
            return new Error(`${propName} of ${value} in ${componentName} should be an account id`);
        }
    }
    // assume all ok
    return null;
}

function objectsListChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (Immutable.List.isList(value) || Immutable.Set.isSet(value) || value instanceof Object) {
            return null
        } else {
            return new Error(`${propName} in ${componentName} should be Immutable.List`);
        }
    }
    // assume all ok
    return null;
}

function assetsListChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (Immutable.List.isList(value) || Immutable.Set.isSet(value) || value instanceof Object) {
            return null
        } else {
            return new Error(`${propName} in ${componentName} should be Immutable.List`);
        }
    }
    // assume all ok
    return null;
}

function accountsListChecker(props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName]) {
        let value = props[propName];
        if (Immutable.List.isList(value) || Immutable.Set.isSet(value) || value instanceof Object) {
            return null
        } else {
            return new Error(`${propName} in ${componentName} should be Immutable.List`);
        }
    }
    // assume all ok
    return null;
}

let ChainObject = createChainableTypeChecker(objectIdChecker);
let ChainAccount = createChainableTypeChecker(accountChecker);
let ChainKeyRefs = createChainableTypeChecker(keyChecker);
let ChainAddressBalances = createChainableTypeChecker(keyChecker);
let ChainAsset = createChainableTypeChecker(assetChecker);
let ChainObjectsList = createChainableTypeChecker(objectsListChecker);
let ChainAccountsList = createChainableTypeChecker(accountsListChecker);
let ChainAssetsList = createChainableTypeChecker(assetsListChecker);

export default {ChainObject, ChainAccount, ChainKeyRefs, ChainAddressBalances, ChainAsset, ChainObjectsList, ChainAccountsList, ChainAssetsList};
