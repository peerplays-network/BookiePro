import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import { TransactionHelper, TransactionBuilder, PrivateKey, FetchChain } from 'graphenejs-lib';

import { BlockchainUtils, ChainTypes, BindToChainState, StringUtils } from '../../utility';

import { acc } from '../../dummyData/accountInfo/acc';
import { acc2 } from '../../dummyData/accountInfo/acc2';
import { Apis } from 'graphenejs-ws';

// Change this property depending on the blockchain you are
const accountName = acc.name

const accountPublicKeys = ['TEST5YV8br6ztoCPQiC8XPJN2BU4jmywMic27QqGcR3DsyjHroViB7'];
const accountPrivateKeys = {
  'TEST5YV8br6ztoCPQiC8XPJN2BU4jmywMic27QqGcR3DsyjHroViB7': PrivateKey.fromWif('5JZpe5ANwzApzR4dPq24AXPVf3VMhDAHs5XV5T126bR255Q8Mhd')
};
const makeOrderSellAsset = '1.3.0';
const makeOrderBuyAsset = '1.3.1';

class TestBookieAccount extends Component {

  static propTypes = {
    account: ChainTypes.ChainAccount.isRequired,
  };

  static defaultProps = {
    account: accountName,
  };

  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      orderCancelInProgressList: [],
      makeOpenOrderInProgress: false,
      fetchRecentHistoryInProgress: false,
      version: '1.0.0'
    };

    this._getAccount = this._getAccount.bind(this);
    this._makeOpenOrder = this._makeOpenOrder.bind(this);
    this._makeTransferTx = this._makeTransferTx.bind(this);

    this._cancelOrder = this._cancelOrder.bind(this);
    this._renderOrderList = this._renderOrderList.bind(this);
    this._getListOfOpenOrders = this._getListOfOpenOrders.bind(this);
    this._fetchRecentTransactionHistory = this._fetchRecentTransactionHistory.bind(this);

    this._onVersionTextInputChange = this._onVersionTextInputChange.bind(this);

  }

  _onVersionTextInputChange(event) {
    const text = event.target.value;
    this.setState({ version: text });
  }

  _getAccount() {
    // Demonstrate sync way of getting object
    // Notice that ii-5 account object is already binded with BindToChainState
    // Therefore the following call will result in fetching the right object from cache
    const object = this.props.account; // this is ii-5 account id
    console.log('Account:\n', object.toJS());
  }

  _fetchRecentTransactionHistory() {
    // Transaction history is contained inside account object
    // Similar to _getAccount(), notice that account is already binded by BindToChainState
    // Therefore the following call will result in an object
    const account = this.props.account; // this is ii-5 account id
    // const history = account.get('history');

    Apis.instance().history_api().exec("get_account_history",
                            [ account.get('id'), '1.11.0', 100, '1.11.0'])
              .then( history => {
                console.log('history', history);
                console.log('Transaction first History:', JSON.stringify(history[0], null, 2));
              });



  }

  _renderOrderList() {
    if (!_.isEmpty(this.state.orderList)) {
      const orderListItems = _.map(this.state.orderList, (orderId) => {
        const disabled = _.includes(this.state.orderCancelInProgressList, orderId);
        return (
          <div key={ orderId }>
            <span key={ orderId + 'label' }>{'Order Id: ' + orderId }</span>
            <Button key={ orderId + 'button' } disabled={ disabled } onClick={ () => { this._cancelOrder(orderId); } }>
              {'Cancel Order'}
            </Button>
          </div>
        );
      });
      return (
        <div>
          <div>------------------------------------------------</div>
          <div>{'Order List'}</div>
          <div>{ orderListItems }</div>
        </div>
      );
    }
    return null;
  }

  _getListOfOpenOrders() {
    // List of open orders is contained inside account object
    // Similar to _getAccount(), notice that account is already binded by BindToChainState
    // Therefore the following call will result in an object
    const object = this.props.account; // this is ii-5 account id
    const orderList = object.get('orders').toJS();
    console.log('Orders:\n', orderList);
    // Store order inside internal state
    this.setState({ orderList });
  }

  _processTransaction(tr, callback) {
    // Set required fees
    tr.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return tr.get_potential_signatures();
    }).then(({ pubkeys }) => {
      console.log( ' pubkeys : ', pubkeys);
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = _.intersection(pubkeys, accountPublicKeys);
      if (_.isEmpty(myPubKeys)) {
        throw new Error('No Potential Signatures');
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return tr.get_required_signatures(myPubKeys);
    }).then((requiredPubKeys) => {
      _.forEach(requiredPubKeys, (requiredPubKey) => {
        // Get private key pair
        const requiredPrivKey = accountPrivateKeys[requiredPubKey];
        // Add signature
        tr.add_signer(requiredPrivKey, requiredPubKey);
      });
      // Broadcast transaction
      return tr.broadcast()
    }).then((res) => {
      console.log('PROCESSING TRANSACTION SUCCESS', res);
      callback(true);
    }).catch((error) => {
      console.error('PROCESSING TRANSACTION FAIL', error);
      callback(false);
    });
  }



  _makeOpenOrder() {
    // Mark open order in progress
    this.setState({ makeOpenOrderInProgress: true });
    FetchChain('getAsset', [makeOrderSellAsset, makeOrderBuyAsset]).then((result) => {
      const sellAsset = result.get('0'); // Core token
      const buyAsset = result.get('1');
      const sellAssetAmount = 0.0123;
      const buyAssetAmount = 10;
      const accountId = acc.id; // this is dummy account id
      const sellAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(sellAssetAmount, sellAsset);
      const buyAssetSatoshiAmount = BlockchainUtils.get_satoshi_amount(buyAssetAmount, buyAsset);
      const expiration = new Date();
      expiration.setYear(expiration.getFullYear() + 5);
      const fillOrKill = false; // Don't know what this one is used for, but from the wallet, "false" value is always used
      const feeId = '1.3.0'; // Just use core token to pay the fee

      // Create transaction and add operation
      const tr = new TransactionBuilder();
      const operationParams = {
        fee: {
          amount: 0,
          asset_id: feeId,
        },
        seller: accountId,
        amount_to_sell: {
          amount: sellAssetSatoshiAmount,
          asset_id: sellAsset.get('id'),
        },
        min_to_receive: {
          amount: buyAssetSatoshiAmount,
          asset_id: buyAsset.get('id'),
        },
        expiration,
        fill_or_kill: fillOrKill,
        feeId,
        extensions: []
      };
      tr.add_type_operation('limit_order_create', operationParams);
      // Process transaction
      this._processTransaction(tr, (success) => {
        // Mark open order in progress finish
        this.setState({ makeOpenOrderInProgress: false });
        if (success) {
          // Refresh order list
          this._getListOfOpenOrders();
        }
      });
    }).catch((error) => {
      console.log('CAUGHT AN ERROR');
      console.error(error);
      this.setState({ makeOpenOrderInProgress: false });
    })

  }

  _cancelOrder(orderId) {
    const accountId = acc.id // this is dummy account id
    const feeId = '1.3.0'; // this is core asset (BTS)

    // Create transaction and add operation
    const tr = new TransactionBuilder();
    const operationParams = {
      fee: {
        amount: 0,
        asset_id: feeId,
      },
      fee_paying_account: accountId,
      order: orderId,
    };
    tr.add_type_operation('limit_order_cancel', operationParams);

    // Add order id to order in progress list, this disable the Button
    let orderCancelInProgressList = this.state.orderCancelInProgressList;
    orderCancelInProgressList = _.concat(orderCancelInProgressList, orderId);
    this.setState({ orderCancelInProgressList });
    // Process transaction
    this._processTransaction(tr, () => {
      // Remove order id from order in progress list, this enable back the button
      orderCancelInProgressList = _.remove(orderCancelInProgressList, orderId);
      this.setState({ orderCancelInProgressList });
      // Refresh order list
      this._getListOfOpenOrders();
    });
  }


  //to demonstrate how to update memo for version update
  _makeTransferTx() {

    this.setState({ makeOpenOrderInProgress: true });
    const accountFrom = acc.id;
    const accountTo = acc2.id;
    const memo_from_public = acc.options.memo_key
    const memo_to_public = acc2.options.memo_key

    const coreAssetIdFrom = '1.3.0';

    // Create transaction and add operation
    const tr = new TransactionBuilder();


    // const memo_from_privkey = PrivateKey.fromWif('5JZpe5ANwzApzR4dPq24AXPVf3VMhDAHs5XV5T126bR255Q8Mhd');

    let versionString = this.state.version;
    if ( versionString.length  === 0 ){
      versionString = '1.0.0';
    }

    // {need_hard_update, need_soft_update}
    // {false, false} ==> no modal  , { true, true} / { true, false } hard update modal, { false, true } soft update modal
    const memoMessage = {
      version: this.state.version,
      displayText: {
        en: '<h1>Updates Available</h1><a href=\'http://www.google.com\' '+
        ' onclick="window.open(\'http://www.google.com\', \'newwindow\', \'width=300, height=250\'); return false;"> Print</a> is a link to latest version of Bookie App.',
        ln: 'Updates Available. Do you want to restart to install these updates now or try again tonight?(ln)https://bitbucket.org'
      }
    };


    const nonce = TransactionHelper.unique_nonce_uint64();
    const msg = StringUtils.string2Bin(JSON.stringify(memoMessage));
    const memo_object = {
      from: memo_from_public,
      to: memo_to_public,
      nonce: nonce,
      message: msg
    }
      // }
    const operationParams = {
      from: accountFrom,
      to: accountTo,
      amount: {
        amount: 1, // minimum amount   0.00001 TESTPLAYS
        asset_id: coreAssetIdFrom,
      },
      memo: memo_object,
      extensions: []
    };

    tr.add_type_operation('transfer', operationParams);
    // Process transaction
    this._processTransaction(tr, (success) => {
      // Mark open order in progress finish
      this.setState({ makeOpenOrderInProgress: false });
      if (success) {
        // Refresh account
        this._getAccount();
      }
    });

  }
  render() {
    return (
      <div>
        <div>
          <Button onClick={ this._getAccount }>
            {'Get Account Info'}
          </Button>
        </div>
        <div>
          <Button onClick={ this._getListOfOpenOrders }>
            {'Get List of Open Orders'}
          </Button>
        </div>
        { this._renderOrderList() }

        <div>
          <Button onClick={ this._fetchRecentTransactionHistory } disabled={ this.state.fetchRecentHistoryInProgress }>
            {'Fetch Recent Transaction History'}
          </Button>
        </div>
        <div>
          <Button onClick={ this._makeOpenOrder } disabled={ this.state.makeOpenOrderInProgress }>
            {'Make Open Order'}
          </Button>
        </div>
        <div>
          <input type='text' name='version' value={ this.state.version } onChange={ this._onVersionTextInputChange }  style={ {  'background':'black'} }/>

          <Button onClick={ this._makeTransferTx } >
            {'Make Transfer to update version number'}
          </Button>
        </div>
      </div>
    );
  }
}

const BindedBlockchainTestAccount = BindToChainState()(TestBookieAccount);
export default BindedBlockchainTestAccount;
