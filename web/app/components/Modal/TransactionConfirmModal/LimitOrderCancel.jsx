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

import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import assetUtils from 'common/asset_utils';
import {FormattedNumber} from 'react-intl';

@connect((state) => {
  return {
    order: state.transactionConfirm.transaction.order,
    fee_paying_account: state.transactionConfirm.transaction.fee_paying_account,
    fee: state.transactionConfirm.transaction.fee
  };
})
class LimitOrderCancel extends React.Component {
  render() {
    let feeValue = this.props.fee
      ? this.props.fee.amount / Math.pow(10, this.props.fee.asset.precision)
      : 0;
    let feeSymbol = this.props.fee
      ? this.props.fee.asset.symbol
      : null;

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.order_id' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.order}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.block.fee_payer' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.fee_paying_account}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
            <div className='mConf__tableRight'>
              <FormattedNumber
                value={ feeValue }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ this.props.fee.asset.precision }
              /> {assetUtils.getSymbol(feeSymbol)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LimitOrderCancel;
