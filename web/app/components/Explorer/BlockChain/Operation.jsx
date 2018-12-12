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
import counterpart from 'counterpart';
import FormattedPrice from './FormattedPrice';
import FormattedAmount from './FormattedAmount';
import TimeRelativeOnce from './TimeRelativeOnce';
import TranslateHtml from '../../Utility/TranslateHtml';
import account_constants from 'chain/account_constants';

let {operations} = require('peerplaysjs-lib').ChainTypes;
let ops = Object.keys(operations);
let listings = account_constants.account_listing;
let trxTypes = counterpart.translate('transaction.trxTypes');

class Operation extends React.Component {
  render() {
    let {operation, deltaBlocks, fee_amount, fee_asset, created_at} = this.props;
    let column = null;
    let price;
    let amount;
    let sender;
    let receiver;

    switch (ops[this.props.type]) { // For a list of trx types, see chain_types.coffee
      case 'game_move':
        sender = operation.from;
        receiver = operation.to;

        if (operation.gesture) {
          column = (<TranslateHtml
            string='operation.game_move_commit'
            keys={ [
              {
                arg: 'to',
                value: operation.to
              }, {
                arg: 'from',
                value: operation.from
              }, {
                arg: 'game_id',
                value: operation.game_id
              }, {
                arg: 'gesture',
                value: operation.gesture
              }
            ] }/>);
        } else {
          column = (
            <TranslateHtml
              string='operation.game_move'
              keys={ [
                {
                  arg: 'to',
                  value: operation.to
                }, {
                  arg: 'from',
                  value: operation.from
                }, {
                  arg: 'game_id',
                  value: operation.game_id
                }
              ] }/>
          );
        }

        break;
      case 'tournament_create':
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.amount }/>
        );
        sender = operation.from;
        receiver = operation.to;
        column = (
          <TranslateHtml
            string='operation.tournament_create'
            keys={ [
              {
                arg: 'to',
                value: operation.to
              }, {
                arg: 'from',
                value: operation.from
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'tournament_join':
        sender = operation.from;
        receiver = operation.to;
        column = (
          <TranslateHtml
            string='operation.tournament_join'
            keys={ [
              {
                arg: 'from',
                value: operation.from
              }, {
                arg: 'tournament_id',
                value: operation.tournament_id
              }
            ] }/>
        );
        break;
      case 'transfer':
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.amount }/>
        );
        sender = operation.from;
        receiver = operation.to;
        column = (
          <TranslateHtml
            string='operation.transfer'
            keys={ [
              {
                arg: 'to',
                value: operation.to
              }, {
                arg: 'from',
                value: operation.from
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'limit_order_create':
        amount = (
          <FormattedAmount asset={ operation.quote_asset } amount={ operation.quote_amount }/>
        );
        price = (
          <FormattedPrice
            base_asset={ operation.base_asset }
            base_amount={ operation.base_amount }
            quote_asset={ operation.quote_asset }
            quote_amount={ operation.quote_amount }
          />
        );
        sender = operation.account;
        column = (
          <TranslateHtml
            string={ operation.isAsk
              ? 'operation.limit_order_sell'
              : 'operation.limit_order_buy' }
            keys={ [
              {
                arg: 'account',
                value: operation.account
              }, {
                arg: 'price',
                value: price
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'limit_order_cancel':
        sender = operation.account;
        column = (
          <TranslateHtml
            string='operation.limit_order_cancel'
            keys={ [{
              arg: 'account',
              value: operation.account
            }
            ] }
            params={ {
              order: operation
                .order
                .substring(4)
            } }/>
        );
        break;
      case 'call_order_update':
        sender = operation.account_name;
        column = (
          <TranslateHtml
            string='operation.call_order_update'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'debtSymbol',
                value: operation.asset_debt.symbol
              }, {
                arg: 'debt',
                value: <FormattedAmount
                  asset={ operation.asset_debt }
                  amount={ operation.asset_debt_amount }/>
              }, {
                arg: 'collateral',
                value: <FormattedAmount
                  asset={ operation.asset_collateral }
                  amount={ operation.asset_collateral_amount }/>
              }
            ] }/>
        );
        break;
      case 'key_create':
        break;
      case 'account_create':
        sender = operation.registrar;
        receiver = operation.new_account;
        column = (
          <TranslateHtml
            string='operation.reg_account'
            keys={ [
              {
                arg: 'registrar',
                value: operation.registrar
              }, {
                arg: 'new_account',
                value: operation.new_account
              }
            ] }/>
        );
        break;
      case 'account_update':
        sender = operation.account_name;
        column = (
          <TranslateHtml
            string='operation.update_account'
            keys={ [{
              arg: 'account',
              value: operation.account_name
            }
            ] }/>
        );
        break;
      case 'account_whitelist':
        let label = operation.new_listing === listings.no_listing
          ? 'unlisted_by'
          : operation.new_listing === listings.white_listed
            ? 'whitelisted_by'
            : 'blacklisted_by';
        sender = operation.authorizing_account_name;
        receiver = operation.account_to_list_name;
        column = (
          <TranslateHtml
            string={ 'operation.' + label }
            keys={ [
              {
                arg: 'lister',
                value: operation.authorizing_account_name
              }, {
                arg: 'listee',
                value: operation.account_to_list_name
              }
            ] }/>
        );
        break;
      case 'account_upgrade':
        break;
      case 'account_transfer':
        break;
      case 'asset_create':
        sender = operation.account_name;
        column = (
          <TranslateHtml
            string='operation.asset_create'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'asset',
                value: operation.symbol
              }
            ] }/>
        );
        break;
      case 'asset_update':
      case 'asset_update_bitasset':
        sender = operation.account_name;
        column = (
          <TranslateHtml
            string='operation.asset_update'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'asset',
                value: operation.asset.symbol
              }
            ] }/>
        );
        break;
      case 'asset_update_feed_producers':
        break;
      case 'asset_issue': //14
        sender = operation.account_name;
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>
        );
        column = (
          <TranslateHtml
            string='operation.asset_issue'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'to',
                value: operation.account_to
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'asset_reserve': //15
        sender = operation.account_name;
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>
        );
        column = (
          <TranslateHtml
            string='operation.asset_reserve'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'asset_fund_fee_pool': //16
        sender = operation.account_name;
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>
        );
        column = (
          <TranslateHtml
            string='operation.asset_fund_fee_pool'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }, {
                arg: 'asset',
                value: operation.asset_n.symbol
              }
            ] }/>
        );
        break;
      case 'asset_settle':
        break;
      case 'asset_global_settle':
        break;
      case 'asset_publish_feed':
        sender = operation.account;
        price = (
          <FormattedPrice
            base_asset={ operation.base_asset }
            base_amount={ operation.base_amount }
            quote_asset={ operation.quote_asset }
            quote_amount={ operation.quote_amount }
          />
        );
        column = (
          <TranslateHtml
            string='operation.publish_feed'
            keys={ [
              {
                arg: 'account',
                value: operation.account
              }, {
                arg: 'price',
                value: price
              }
            ] }/>
        );
        break;
      case 'witness_create':
        break;
      case 'witness_withdraw_pay':
        break;
      case 'witness_update': //21
        sender = operation.from;
        receiver = operation.to;
        column = (
          <TranslateHtml
            string='operation.witness_update'
            keys={ [{
              arg: 'account',
              value: operation.account_name
            }
            ] }/>
        );
        break;
      case 'proposal_create': //22
        column = (
          <TranslateHtml
            string='operation.proposal_create'
            keys={ [{
              arg: 'account',
              value: operation.account_name
            }
            ] }/>
        );
        break;
      case 'proposal_update':
        break;
      case 'proposal_delete':
        break;
      case 'withdraw_permission_create':
        break;
      case 'withdraw_permission_update':
        break;
      case 'withdraw_permission_claim':
        break;
      case 'withdraw_permission_delete':
        break;
      case 'fill_order':
        break;
      case 'global_parameters_update':
        break;
      case 'vesting_balance_create':
        break;
      case 'vesting_balance_withdraw': //33
        sender = operation.account_name;
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>
        );
        column = (
          <TranslateHtml
            string='operation.vesting_balance_withdraw'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'balance_claim': //37
        sender = operation.account_name;
        amount = (
          <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>
        );
        column = (
          <TranslateHtml
            string='operation.balance_claim'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'worker_create':
        break;
      case 'committee_member_create':
        break;
      case 'transfer_to_blind':
        sender = operation.account_name;
        amount = <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>;
        column = (
          <TranslateHtml
            string='operation.transfer_to_blind'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'transfer_from_blind':
        sender = operation.account_name;
        amount = <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>;
        column = (
          <TranslateHtml
            string='operation.transfer_from_blind'
            keys={ [
              {
                arg: 'account',
                value: operation.account_name
              }, {
                arg: 'amount',
                value: amount
              }
            ] }/>
        );
        break;
      case 'asset_claim_fees':
        sender = operation.account_name;
        amount = <FormattedAmount asset={ operation.asset } amount={ operation.asset_amount }/>;
        column = (
          <TranslateHtml
            string='operation.asset_claim_fees'
            keys={ [
              {
                arg: 'amount',
                value: amount
              }, {
                arg: 'from',
                value: operation.asset.symbol
              }
            ] }/>
        );
        break;
      case 'custom':
        break;
      case 'committee_member_update_global_parameters':
        break;
      case 'override_transfer':
        break;
      default:
        console.log('unimplemented op:');
    }

    return (
      <div className='tableRow'>
        <div className='tableCell'>
          <div className='btn btn-mark pulledLeftMinus20'>
            {trxTypes[ops[this.props.type]]
              ? trxTypes[ops[this.props.type]]
              : ops[this.props.type]}
          </div>
        </div>
        <div className='tableCell'>
          {sender
            ? sender
            : '—'}
        </div>
        <div className='tableCell'>
          {receiver
            ? receiver
            : '—'}
        </div>
        <div className='tableCell'>
          {column} {(deltaBlocks > 0)
            ? counterpart.translate('operation.pending', {blocks: deltaBlocks})
            : null}
          fee —
          <FormattedAmount asset={ fee_asset } amount={ fee_amount }/>
        </div>
        <div className='tableCell text__gray text_r'>
          <TimeRelativeOnce time={ created_at }/>
        </div>
      </div>
    );
  }

}

export default Operation;