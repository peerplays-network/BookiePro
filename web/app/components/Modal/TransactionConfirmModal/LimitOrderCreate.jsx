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
import {FormattedDate, FormattedNumber} from 'react-intl';
import FormattedPrice from 'components/Utility/FormattedPrice';
import FormattedAsset from 'components/Utility/FormattedAsset';
import assetUtils from 'common/asset_utils';

@connect((state) => {
  return {
    amount_to_sell: state.transactionConfirm.transaction.amount_to_sell,
    operationType: state.transactionConfirm.transaction.operationType,
    min_to_receive: state.transactionConfirm.transaction.min_to_receive,
    seller: state.transactionConfirm.transaction.seller,
    expiration: state.transactionConfirm.transaction.expiration,
    fee: state.transactionConfirm.transaction.fee
  };
})
class LimitOrderCreate extends React.Component {
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
            <div className='mConf__tableLeft'><Translate content='exchange.price' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {
                  this.props.operationType === 'buy'
                    ? <FormattedPrice
                      base_asset={ this.props.amount_to_sell.asset_id }
                      quote_asset={ this.props.min_to_receive.asset_id }
                      base_amount={ this.props.amount_to_sell.amount }
                      quote_amount={ this.props.min_to_receive.amount } />
                    : <FormattedPrice
                      base_asset={ this.props.min_to_receive.asset_id }
                      quote_asset={ this.props.amount_to_sell.asset_id }
                      base_amount={ this.props.min_to_receive.amount }
                      quote_amount={ this.props.amount_to_sell.amount } />
                }
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='exchange.sell' /></div>
            <div className='mConf__tableRight'>
              <span className={ this.props.operationType === 'sell' ? 'mark2' : '' }>
                <FormattedAsset
                  amount={ this.props.amount_to_sell.amount }
                  asset={ this.props.amount_to_sell.asset_id }
                />
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='exchange.buy' /></div>
            <div className='mConf__tableRight'>
              <span className={ this.props.operationType === 'buy' ? 'mark2' : '' }>
                <FormattedAsset
                  amount={ this.props.min_to_receive.amount }
                  asset={ this.props.min_to_receive.asset_id }
                />
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
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.seller' /></div>
            <div className='mConf__tableRight'>
              {this.props.seller}
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.expiration' /></div>
            <div className='mConf__tableRight'>
              <FormattedDate
                value={ this.props.expiration }
                format='full'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LimitOrderCreate;
