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
import {FormattedNumber} from "react-intl";
import utils from "common/utils";
import assetUtils from "common/asset_utils";
import {PropTypes} from "react";
import {Link} from "react-router";
import Popover from "react-popover";
import MarketLink from "./MarketLink";
import HelpContent from "./HelpContent";
import AssetNameNew from "./AssetNameNew";

/**
 *  Given an amount and an asset, render it with proper precision
 *
 *  Expected Properties:
 *     asset:  asset id, which will be fetched from the
 *     amount: the ammount of asset
 *
 */


class FormattedAssetNew extends React.Component {

    static propTypes = {
        amount: PropTypes.any.isRequired,
        asset: PropTypes.object,
        exact_amount: PropTypes.bool,
        decimalOffset: PropTypes.number,
        color: PropTypes.string,
        hide_asset: PropTypes.bool,
        hide_amount: PropTypes.bool,
        asPercentage: PropTypes.bool,
        assetInfo: PropTypes.node
    };

    static defaultProps = {
        amount: 0,
        decimalOffset: 0,
        hide_asset: false,
        hide_amount: false,
        asPercentage: false,
        assetInfo: null
    };

    static contextTypes = {
        history: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {isPopoverOpen: false};
        this.togglePopover = this.togglePopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
    }

    togglePopover(e) {
        e.preventDefault();
        this.setState({isPopoverOpen: !this.state.isPopoverOpen});
    }

    closePopover() {
        this.setState({isPopoverOpen: false});
    }

    render() {
        let {amount, decimalOffset, color, asset, issuer, hide_asset, hide_amount, asPercentage} = this.props;

        let assetImm = asset;
        if( asset && asset.toJS ) asset = asset.toJS();

        let colorClass = color ? "facolor-" + color : "";

        let precision = utils.get_asset_precision(asset.precision);

        let decimals = Math.max(0, asset.precision - decimalOffset);

        if (hide_amount) {
            colorClass += " no-amount";
        }

        if (asPercentage) {
            let supply = parseInt(asset.dynamic.current_supply, 10);
            let percent = utils.format_number((amount / supply) * 100, 4);
            return (
                <span className={colorClass}>
                    {percent}%
                </span>
            )

        }


        let issuerName = (issuer && issuer.get('name')) ? issuer.get('name') : '';

        let description = assetUtils.parseDescription(asset.options.description);

        const currency_popover_body = !hide_asset && this.props.assetInfo && <div>
                <HelpContent
                    path={"assets/Asset"}
                    section="summary"
                    symbol={asset.symbol}
                    description={description.short_name ? description.short_name : description.main}
                    issuer={issuerName}
                />
            {this.props.assetInfo}
            </div>;

        return (
            <span className={colorClass}  >
                {!hide_amount ?
                    <FormattedNumber
                        value={this.props.exact_amount ? amount : amount / precision}
                        minimumFractionDigits={0}
                        maximumFractionDigits={decimals}
                    />
                    : null}
                {!hide_asset && (this.props.assetInfo ? (
                    <span>&nbsp;
                        <Popover
                            isOpen={this.state.isPopoverOpen}
                            onOuterAction={this.closePopover}
                            body={currency_popover_body}
                        >
                            <span className="currency click-for-help" onClick={this.togglePopover}><AssetNameNew asset={assetImm} name={asset.symbol} /></span>
                        </Popover></span>) :
                    <span className="currency" onClick={this.togglePopover}> <AssetNameNew asset={assetImm} name={asset.symbol} /></span>)}
            </span>
        );
    }
}

export default FormattedAssetNew;

