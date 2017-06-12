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

import React from "react";
import {Link} from "react-router";
import ChainTypes from "./ChainTypes";
import BindToChainState from "./BindToChainState";
import utils from "common/utils";
import AssetName from "./AssetName";

/**
 *  Given a base and quote asset, render a link to that market
 *
 *  Expected Properties:
 *     base:  asset id, which will be fetched from the ChainStore
 *     quote: either an asset id or a balance id 
 *
 */

@BindToChainState()
class MarketLink extends React.Component {

    static propTypes = {
        quote: ChainTypes.ChainObject.isRequired,
        base: ChainTypes.ChainObject.isRequired
    };

    static defaultProps = {
        base: "1.3.0"
    };

    render() {
        let {base, quote} = this.props;
        if (base.get("id") === quote.get("id")) {
            return null;
        }
        let marketID = quote.get("symbol") + "_" + base.get("symbol");
        let marketName = <span><AssetName name={quote.get("symbol")} /> : <AssetName name={base.get("symbol")} /></span>;
        return (
            <Link to={`/market/${marketID}`}>{marketName}</Link>
        );
    }
}

@BindToChainState()
class ObjectWrapper extends React.Component {

    static propTypes = {
        object: ChainTypes.ChainObject.isRequired
    };

    render () {
        let {object} = this.props;
        let quoteAsset = object.has("asset_type") ? object.get("asset_type") : object.get("id");

        return <MarketLink quote={quoteAsset} />
    }
}

MarketLink.ObjectWrapper = ObjectWrapper;

export default MarketLink;
