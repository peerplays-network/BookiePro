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

import AssetName from "./AssetName";

class FormattedAmount extends React.Component {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        decimalOffset: 0
    };

    render() {

        let {asset, amount, decimalOffset} = this.props;

        let precision = utils.get_asset_precision(asset.precision);

        let decimals = Math.max(0, asset.precision - decimalOffset);

        let value = amount / precision;

        if (isNaN(value) || !isFinite(value)) {
            return <span>n/a</span>;
        }

        return (<span>
            <FormattedNumber
                value={value}
                minimumFractionDigits={2}
                maximumFractionDigits={decimals}
            />

            <AssetName asset={asset} />

        </span>);


    }
}

export default FormattedAmount;