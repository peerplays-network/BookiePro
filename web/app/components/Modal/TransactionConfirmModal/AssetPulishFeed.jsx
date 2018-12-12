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


@connect((state) => {
  return {
    publisher: state.transactionConfirm.transaction.publisher,
    asset_id: state.transactionConfirm.transaction.asset_id,
    feed: state.transactionConfirm.transaction.feed
  };
})
class AssetPublishFeed extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.asset_publish_feed' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='transaction.publisher' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.publisher}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.asset.title' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.asset_id}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.asset.price_feed.maximum_short_squeeze_ratio' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {(this.props.feed.maximum_short_squeeze_ratio / 1000).toFixed(2)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.asset.price_feed.maintenance_collateral_ratio' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {(this.props.feed.maintenance_collateral_ratio / 1000).toFixed(2)}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='markets.core_rate' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedPrice
                  base_asset={ this.props.feed.core_exchange_rate.base.asset_id }
                  quote_asset={ this.props.feed.core_exchange_rate.quote.asset_id }
                  base_amount={ this.props.feed.core_exchange_rate.base.amount }
                  quote_amount={ this.props.feed.core_exchange_rate.quote.amount }
                />
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.settlement_price' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <FormattedPrice
                  base_asset={ this.props.feed.settlement_price.base.asset_id }
                  quote_asset={ this.props.feed.settlement_price.quote.asset_id }
                  base_amount={ this.props.feed.settlement_price.base.amount }
                  quote_amount={ this.props.feed.settlement_price.quote.amount }
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetPublishFeed;
