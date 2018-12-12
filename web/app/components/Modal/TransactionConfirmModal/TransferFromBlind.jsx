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
import FormattedAsset from '../Utility/FormattedAsset';
import Inspector from 'react-json-inspector';

@connect((state) => {
  return {
    amount: state.transactionConfirm.transaction.amount,
    to: state.transactionConfirm.transaction.to,
    blinding_factor: state.transactionConfirm.transaction.blinding_factor,
    outputs: state.transactionConfirm.transaction.outputs
  };
})
class TransferFromBlind extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.transfer_from_blind' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.to' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.to}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transfer.amount' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedAsset
                  amount={ this.props.amount.amount }
                  asset={ this.props.amount.asset_id }
                />
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.blinding_factor' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.blinding_factor}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.outputs' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.outputs } search={ false } />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TransferFromBlind;
