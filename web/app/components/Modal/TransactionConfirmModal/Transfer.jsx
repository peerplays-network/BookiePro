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

import React from 'react'
import Translate from "react-translate-component";
import counterpart from "counterpart";
import { connect } from 'react-redux';
import {FormattedNumber} from 'react-intl';
import assetUtils from "common/asset_utils";


@connect(state => {
    return {
        nameFrom: state.transactionConfirm.transaction.nameFrom,
        nameTo: state.transactionConfirm.transaction.nameTo,
        amount: state.transactionConfirm.transaction.amount,
        fee: state.transactionConfirm.transaction.fee
    };
})
class Transfer extends React.Component {

    render() {
        const {amount, fee} = this.props;
        const amountValue = (amount.amount && !isNaN(amount.amount / Math.pow(10,amount.asset.precision))) ? (amount.amount / Math.pow(10,amount.asset.precision)) : 0;
        let feeValue = fee ? fee.amount / Math.pow(10, fee.asset.precision) : 0;
        let feeSymbol = this.props.fee ? this.props.fee.asset.symbol : null;

        return (
            <div className="mConf__table">
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="transaction.from" /></div>
                    <div className="mConf__tableRight"><span className="mark2">{this.props.nameFrom}</span></div>
                </div>
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="transaction.to" /></div>
                    <div className="mConf__tableRight"><span className="mark2">{this.props.nameTo}</span></div>
                </div>
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="transfer.amount" /></div>
                    <div className="mConf__tableRight">
                        <FormattedNumber
                            value={amountValue}
                            minimumFractionDigits={0}
                            maximumFractionDigits={this.props.amount.asset.precision}
                        /> {assetUtils.getSymbol(this.props.amount.asset.symbol)}
                    </div>
                </div>
                <div className="mConf__tableRow">
                    <div className="mConf__tableLeft"><Translate content="transfer.fee" /></div>
                    <div className="mConf__tableRight">
                        <FormattedNumber
                            value={feeValue}
                            minimumFractionDigits={0}
                            maximumFractionDigits={fee.asset.precision}
                        /> {assetUtils.getSymbol(feeSymbol)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Transfer;
