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

import SendHistoryRow from './SendHistoryRow';

@connect((state) => {
  return {
    last_irreversible_block_num: state.sendPage.last_irreversible_block_num,
    block_interval: state.sendPage.block_interval,
    head_block_number: state.sendPage.head_block_number,
    time: state.sendPage.time,
    history: state.sendPage.history,
    historyAssets: state.sendPage.historyAssets
  };
})
class SendHistory extends React.Component {
  render() {
    let historyTable = this.props.history.length
      ? this.props.history.slice(0, 25).map((obj, index) => {
        const action = obj.op[1].from === this.props.accountId ? 'send' : 'receive';
        const head_block_time = new Date(this.props.time + '+00:00');
        const seconds_below = (this.props.head_block_number - obj.block_num)
          * this.props.block_interval;
        const time = new Date(head_block_time - seconds_below * 1000);
        const status = obj.block_num > this.props.last_irreversible_block_num ? 'pending' : 'done';
        const asset = this.props.historyAssets.filter(
          (item) => item.id === obj.op[1].amount.asset_id
        )[0];
        const amount = obj.op[1].amount.amount;

        return (
          <SendHistoryRow
            key={ index }
            action={ action }
            time={ time }
            status={ status }
            blocks={ obj.block_num - this.props.last_irreversible_block_num }
            symbol={ assetUtils.getSymbol(asset.symbol) }
            amount={ amount }
            precision={ asset.precision }
          />
        );
      })
      : null;

    return (
      <div className='table__wrap pt-30'>
        <h3 className='h3'><Translate content='transfer.account_history_title'/></h3>
        <div className='table table2 table-send-history'>
          <div className='table__head tableRow'>
            <div className='tableCell'><Translate content='transfer.action'/></div>
            <div className='tableCell '><Translate content='transfer.date'/></div>
            <div className='tableCell'><Translate content='transfer.status'/></div>
            <div className='tableCell'><Translate content='transfer.coin'/></div>
            <div className='tableCell text_r'><Translate content='transfer.amount'/></div>
          </div>
          <div className='table__body'>
            {historyTable}
          </div>
        </div>
      </div>
    );
  }
}

export default SendHistory;
