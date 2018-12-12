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
import utils from 'common/utils';
import Inspector from 'react-json-inspector';

@connect((state) => {
  return {
    op: state.transactionConfirm.transaction.op
  };
})
class AssetCreate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_create' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.assets.issuer' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.issuer}
              </span>
            </div>
          </div>

          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.assets.symbol' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.symbol}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.assets.precision' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.precision}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.user_issued_assets.max_supply' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {utils.format_asset(this.props.op.common_options.max_supply, this.props.op)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.user_issued_assets.description' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.common_options.description}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='transaction.market_fee' /></div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.common_options.market_fee_percent / 100}%
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.max_market_fee' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {utils.format_asset(this.props.op.common_options.max_market_fee,this.props.op)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.common_options' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.op } search={ false } />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetCreate;
