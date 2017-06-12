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
import {connect} from 'react-redux';
import {FormattedNumber} from "react-intl";
import NavigateActions from 'actions/NavigateActions';
import asset_utils from "common/asset_utils";
import Translate from "react-translate-component";
import { getTotalVestingBalances } from 'selectors/SideVesting'

@connect(
    (state)=> {

        let data = getTotalVestingBalances(state);

        return {

            totalAmount: data.totalAmount,
            totalClaimable: data.totalClaimable,

            asset: state.dashboardPage.vestingAsset
        }
    },
    {
        navigateToVestingBalances: NavigateActions.navigateToVestingBalances
    }
)
class SideVesting extends React.Component {

    navigateToVestingBalances() {
        this.props.navigateToVestingBalances();
    }

    render() {

        let {asset, totalAmount, totalClaimable} = this.props,
            symbol;

        if (asset) {
            symbol = asset_utils.getSymbol(asset.get('symbol'))
        }

        return (
            <div className="aside__item bb">
                <Translate component="div" className="aside__title" content="dashboard.side.vesting_balances" />
                <div className="aside__row">
                    <Translate component="div" className="aside__rowLabel2" content="dashboard.side.total" />
                    <div className="aside__unit">{symbol}</div>
                    <div className="aside__num">{totalAmount && asset ?
                        <FormattedNumber
                            value={totalAmount ? totalAmount / Math.pow(10, asset.get('precision')) : totalAmount }
                            minimumFractionDigits={0}
                            maximumFractionDigits={asset.get('precision')}
                        />
                        :
                        0
                    }</div>
                </div>
                <div className="aside__row">
                    <Translate component="div" className="aside__rowLabel2" content="dashboard.side.claimable" />
                    <div className="aside__unit">{symbol}</div>
                    <div className="aside__num">{totalClaimable && asset ?
                        <FormattedNumber
                            value={totalClaimable ? totalClaimable / Math.pow(10, asset.get('precision')) : totalClaimable }
                            minimumFractionDigits={0}
                            maximumFractionDigits={asset.get('precision')}
                        />
                        :
                        0
                    }</div>
                </div>
                <div className="aside__btnWrap">
                    <button className="btn aside__btn" type="button" onClick={this.navigateToVestingBalances.bind(this)}>
                        <span className="aside__btnIcon icon-claim"></span>
                        <Translate component="span" className="" content="dashboard.side.claim_balances" />
                    </button>
                </div>
            </div>
        );
    }
}

export default SideVesting;
