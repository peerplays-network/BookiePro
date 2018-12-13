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
import TimeAgo from '../Utility/TimeAgo';
import FormattedAsset from '../Utility/FormattedAsset';

@connect((state) => {
  return {
    asset: state.voting.witnesses.asset,
    blockInterval: state.voting.witnesses.blockInterval,
    mostRecent: state.voting.witnesses.currentAslot
  };
})
class WitnessRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.mostRecent !== this.props.mostRecent
    );
  }

  render() {
    let {witnessAccount, witness, rank, asset, blockInterval} = this.props;

    if ( !witness ) {
      return null;
    }

    let lastAsloteTime = new Date(
      Date.now() - ((this.props.mostRecent - witness.last_aslot ) * blockInterval * 1000)
    );

    return (
      <div className='tableRow'>
        <div className='tableCell'>{rank}</div>
        <div className='tableCell'>{witnessAccount.name}</div>
        <div className='tableCell light text_r'><TimeAgo time={ new Date(lastAsloteTime) }/></div>
        <div className='tableCell text_r'>{witness.last_confirmed_block_num}</div>
        <div className='tableCell text_r'>{witness.total_missed}</div>
        <div className='tableCell text_r'>
          <FormattedAsset
            amount={ witness.total_votes }
            asset={ asset.id }
            decimalOffset={ asset.precision } /> {asset.symbol}
        </div>
      </div>
    );
  }
}


export default WitnessRow;
