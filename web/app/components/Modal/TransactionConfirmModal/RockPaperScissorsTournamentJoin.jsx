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
import asset_utils from 'common/asset_utils';

@connect((state) => {
  return {
    transaction: state.transactionConfirm.transaction.transactionObject,
    operation: state.transactionConfirm.transaction.operation,
    payer: state.transactionConfirm.transaction.payer,
    player: state.transactionConfirm.transaction.player,
    asset: state.transactionConfirm.transaction.asset

  };
})
class RockPaperScissorsTournamentJoin extends React.Component {
  render() {
    let rows = [],
      operation = this.props.operation,
      transaction = this.props.transaction;
    let trx = transaction.serialize();

    if (trx.operations.length && trx.operations[0][1]) {
      operation = trx.operations[0][1];
    } else {
      return null;
    }

    let payer = this.props.payer;
    let player = this.props.player;
    let asset = this.props.asset;
    let key = 0;
    let amountValue = asset && operation.buy_in.amount
      ? operation.buy_in.amount / Math.pow(10, asset.precision)
      : 0;
    let amountFeeValue = asset && operation.fee.amount
      ? operation.fee.amount / Math.pow(10, asset.precision)
      : 0;

    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.payer' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              payer
                ? payer.name
                : operation.payer_account_id
            }
          </span>
        </div>
      </div>
    );

    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.player' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              player
                ? player.name
                : operation.player_account_id
            }
          </span>
        </div>
      </div>
    );

    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.rps_game_id' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {operation.tournament_id}
          </span>
        </div>
      </div>
    );

    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='games.rps_game.buy_in' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              amountValue
                ? amountValue
                : operation.buy_in.amount
            } / {
              asset
                ? asset_utils.getSymbol(asset.symbol)
                : operation.buy_in.asset_id
            }
          </span>
        </div>
      </div>
    );
    rows.push(
      <div  key={ key++ } className='mConf__tableRow'>
        <div className='mConf__tableLeft'><Translate content='transfer.fee' /></div>
        <div className='mConf__tableRight'>
          <span className='mark2'>
            {
              amountFeeValue
                ? amountFeeValue
                : operation.fee.amount
            } / {
              asset
                ? asset_utils.getSymbol(asset.symbol)
                : operation.fee.asset_id
            }
          </span>
        </div>
      </div>
    );

    return (
      <div className='mConf__content'>
        <div className='mConf__table'>
          {rows}
        </div>
      </div>
    );
  }
}

export default RockPaperScissorsTournamentJoin;
