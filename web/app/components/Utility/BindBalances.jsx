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

import BindToChainState from "../Utility/BindToChainState";
import {connect} from 'react-redux';
import React from "react";
import ChainTypes from "components/Utility/ChainTypes";
import Immutable from "immutable";

@connect(
    (state)=>{
        return {
            unit : state.settings.unit,
            marketStats: state.market.allMarketStats
        };
    }
)
@BindToChainState({keep_updating: true})
class BindBalances extends React.Component {
    static propTypes = {
        balances: ChainTypes.ChainObjectsList
    };

    render(){
        let {balances, unit} = this.props,
            assets = Immutable.List(),
            amounts = [];

        unit = unit || "1.3.0";

        balances.forEach(balance => {
            if (balance) {
                assets = assets.push(balance.get("asset_type"));
                amounts.push({asset_id: balance.get("asset_type"), amount: parseInt(balance.get("balance"), 10)});
            }
        });


        return (
            <BindAssets {...this.props} balances={amounts} fromAssets={assets} toAsset={unit} />
        );
    }

}

@BindToChainState({keep_updating: true})
class BindAssets extends React.Component {
    static propTypes = {
        fromAssets: ChainTypes.ChainAssetsList.isRequired,
        toAsset: ChainTypes.ChainAsset.isRequired,
    };

    render() {
        let Component = this.props.component;

        return (
            <Component {...this.props} />
        );
    }
}

export default BindBalances;