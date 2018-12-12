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
import {connect} from 'react-redux';
import utils from 'common/utils';
import {FormattedDate} from 'react-intl';
import Translate from 'react-translate-component';

class RecentBlocks extends React.Component {

  render() {

    let {latestBlocks} = this.props,
      blocks = latestBlocks.map((block) => {
        return (
          <div className='tableRow' key={ block.id }>
            <div className='tableCell'>#{utils.format_number(block.id, 0)}</div>
            <div className='tableCell text__gray text_r'>
              <FormattedDate value={ block.timestamp } format='time'/>
            </div>
            <div className='tableCell'>{block.witness_account_name}
              - {block.witness}</div>
            <div className='tableCell text_r'>
              {utils.format_number(block.transactions.length, 0)}
            </div>
          </div>
        );
      }).toArray();

    return (
      <div className='table__section'>
        <h2 className='h2'><Translate
          className=''
          content='explore.blockchain.recent_blocks.title'
          component='span'/>
        </h2>

        <div className='table table2 table-db-rec-blocks'>
          <div className='table__head tableRow'>
            <div className='tableCell'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.block_id'
                component='span'/>
            </div>
            <div className='tableCell text_r'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.date'
                component='span'/>
            </div>
            <div className='tableCell'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.witness'
                component='span'/>
            </div>
            <div className='tableCell text_r'>
              <Translate
                className=''
                content='explore.blockchain.recent_blocks.transaction_count'
                component='span'/>
            </div>
          </div>
          <div className='table__body'>
            {blocks}
          </div>
        </div>

      </div>
    );
  }
}

RecentBlocks = connect((state) => {
  return {latestBlocks: state.explorerBlockchainPage.latestBlocks};
})(RecentBlocks);

export default RecentBlocks;