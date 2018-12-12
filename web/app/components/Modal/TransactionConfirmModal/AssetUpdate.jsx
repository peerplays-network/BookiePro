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
import FormattedPrice from '../Utility/FormattedPrice';
import Inspector from 'react-json-inspector';

@connect((state) => {
  return {
    asset_to_update: state.transactionConfirm.transaction.asset_to_update,
    issuer: state.transactionConfirm.transaction.issuer,
    new_issuer: state.transactionConfirm.transaction.new_issuer,
    new_options: state.transactionConfirm.transaction.new_options
  };
})
class AssetUpdate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_update'/>
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.asset_update'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.asset_to_update}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='explorer.assets.issuer'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.issuer}
              </span>
            </div>
          </div>
          { this.props.new_issuer !== this.props.issuer
            ? <div className='mConf__tableRow'>
              <div className='mConf__tableLeft'>
                <Translate content='account.user_issued_assets.new_issuer'/>
              </div>
              <div className='mConf__tableRight'>
                <span className='mark2'>
                  {this.props.new_issuer}
                </span>
              </div>
            </div>
            : null
          }
          { this.props.new_options.core_exchange_rate
            ? <div className='mConf__tableRow'>
              <div className='mConf__tableLeft'><Translate content='markets.core_rate' /></div>
              <div className='mConf__tableRight'>
                <span className='mark2'>
                  <FormattedPrice
                    base_asset={ this.props.new_options.core_exchange_rate.base.asset_id }
                    quote_asset={ this.props.new_options.core_exchange_rate.quote.asset_id }
                    base_amount={ this.props.new_options.core_exchange_rate.base.amount }
                    quote_amount={ this.props.new_options.core_exchange_rate.quote.amount }
                  />
                </span>
              </div>
            </div>
            : null
          }
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.new_options'/>
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Inspector data={ this.props.new_options } search={ false }/>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetUpdate;
