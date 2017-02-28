import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import { ChainStore, TransactionBuilder, PrivateKey, FetchChain } from 'graphenejs-lib';
import { Apis } from 'graphenejs-ws';
import { BlockchainUtils, ChainTypes, BindToChainState } from '../../utility'
import { connect } from 'react-redux';
import AssetActions from '../../actions/AssetActions';

class BlockchainTestPage extends Component {
  static propTypes = {
      account: ChainTypes.ChainAccount.isRequired,
      sellAsset: ChainTypes.ChainAsset.isRequired,
      buyAsset: ChainTypes.ChainAsset.isRequired,
  };

  static defaultProps = {
    account: 'ii-5',
    sellAsset: '1.3.0',
    buyAsset: '1.3.121'
  };

  constructor(props) {
    super(props);
    this.state = {
      objectIdTextInputValue: '',
      orderList: [],
      orderCancelInProgressList: [],
      makeOpenOrderInProgress: false,
      fetchRecentHistoryInProgress: false,
      fetchMarketLimitOrdersInSeriesInProgress: false,
      fetchMarketLimitOrdersInParallelInProgress: false,
      getObjectInProgress: false
    };

    this._makeOpenOrder = this._makeOpenOrder.bind(this);
    this._onObjectIdTextInputChange = this._onObjectIdTextInputChange.bind(this);
    this._getObject = this._getObject.bind(this);
    this._cancelOrder = this._cancelOrder.bind(this);
    this._renderOrderList = this._renderOrderList.bind(this);
    this._renderAssetList = this._renderAssetList.bind(this);
    this._getListOfOpenOrders = this._getListOfOpenOrders.bind(this);
    this._fetchRecentTransactionHistory = this._fetchRecentTransactionHistory.bind(this);
    this._fetchMarketLimitOrdersInSeries = this._fetchMarketLimitOrdersInSeries.bind(this);
    this._fetchMarketLimitOrdersInParallel = this._fetchMarketLimitOrdersInParallel.bind(this);
  }

  _getObject() {
    this.setState({ getObjectInProgress: true });
    // Demonstrate async way of getting object by transforming getObject with FetchChain
      FetchChain('getObject', this.state.objectIdTextInputValue).then((object) => {
        if (object === null) {
          console.log('No such object');
        } else {
          console.log('Object ', this.state.objectIdTextInputValue + ':\n', object.toJS());
        }
      }).catch((error) => {
        console.log('CAUGHT AN ERROR');
        console.error(error);
      }).then(() => {
        this.setState({ getObjectInProgress: false });
      })
  }

  _getCurrentBlockchainData() {
    // Demonstrate sync way of getting object
    // Since object 2.1.0 is already retrieved in ChainStore.init, the following call will fetch the object from the cache
    const object = ChainStore.getObject('2.1.0');
    if (!object) {
      console.log('Fetching data in progress... Please try again in a moment...');
      return;
    }
    console.log('Current Blockchain data:\n', object.toJS());
  }

  _getGlobalParameter() {
    // Demonstrate sync way of getting object
    // Since object 2.0.0 has never been retrieved before, the first call will return undefined until it finishes fetching it from blockchain
    // The next time you call this again, it will fetch it from the cache
    // Normally (and ought to) the usage of ChainStore in sync way is used together with BindToChainState
    const object = ChainStore.getObject('2.0.0');
    if (!object) {
      console.log('Fetching data in progress... Please try again in a moment...');
      return;
    }
    console.log('Blockchain Global Parameter:\n', object.toJS());
  }

  _getAccount() {
    // Demonstrate sync way of getting object
    // Notice that ii-5 account object is already binded with BindToChainState
    // Therefore the following call will result in fetching the right object from cache
    const object = ChainStore.getAccount('ii-5'); // this is ii-5 account id
    console.log('Account:\n', object.toJS());
  }

  _fetchRecentTransactionHistory() {
    // Transaction history is contained inside account object
    // Similar to _getAccount(), notice that account is already binded by BindToChainState
    // Therefore the following call will result in an object
    const account = ChainStore.getAccount('ii-5'); // this is ii-5 account id
    const history = account.get('history');
    console.log('Transaction History:', history.toJS());
  }

  _fetchMarketLimitOrdersInParallel() {
    // Demonstrate the speed of fetching 10 market orders in parallel
    this.setState( { fetchMarketLimitOrdersInParallelInProgress: true });
    Promise.all([
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.943', 20]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.113', 10]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.121', 5]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.562', 0]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.861', 1000]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.973', 10000]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.103', 100]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.120', 100]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.106', 100]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.924', 100])
    ]).then((values) => {
      let marketLimitOrders = [];
      for(let i = 0; i < values.length; i++) {
        marketLimitOrders = _.concat(marketLimitOrders, values[i]);
      }
      this.setState({ fetchMarketLimitOrdersInParallelInProgress: false });
      console.log('MARKET LIMIT ORDERS', marketLimitOrders);
    })
  }

  _fetchMarketLimitOrdersInSeries() {
    // Demonstrate the speed of fetching 10 market orders in series
    let marketLimitOrders = [];
    const appendMarketLimitOrders = (newFetchedLimitOrders) => {
      marketLimitOrders = _.concat(marketLimitOrders, newFetchedLimitOrders);
    }

    // Test fetching twenty market limit orders sequentially
    this.setState( { fetchMarketLimitOrdersInSeriesInProgress: true });
    Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.943', 100])
      .then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.113', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.121', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.562', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.861', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.973', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.103', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.120', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.106', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
        return Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.924', 100]);
      }).then(limitOrders => {
        console.log('LIMIT ORDERS FETCHED');
        appendMarketLimitOrders(limitOrders);
      }).catch( error => {
        console.log('CAUGHT AN ERROR');
        console.log(error);
      }).then(() => {
        console.log('LIMIT ORDERS FETCH DONE');
        this.setState({ fetchMarketLimitOrdersInSeriesInProgress: false });
        console.log('MARKET LIMIT ORDERS', marketLimitOrders);
      })
  }

  _getListOfOpenOrders() {
    // List of open orders is contained inside account object
    // Similar to _getAccount(), notice that account is already binded by BindToChainState
    // Therefore the following call will result in an object
    const object = ChainStore.getAccount('ii-5'); // this is ii-5 account id
    const orderList = object.get('orders').toJS();
    console.log('Orders:\n', orderList);
    // Store order inside internal state
    this.setState({ orderList });
  }

  _processTransaction(tr, callback) {
    // In this case, both public key and private key are hardcoded
    const ii5PublicKeys = ['BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G'];
    const ii5PrivateKeys = {
      'BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G': PrivateKey.fromWif('5JxYc27FySQWqacFWogGqTjuV6mhVoceao5bZFTsJ3v9kTgK8Hj')
    };

    // Set required fees
    tr.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return tr.get_potential_signatures();
    }).then(({ pubkeys }) => {
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = _.intersection(pubkeys, ii5PublicKeys);
      if (_.isEmpty(myPubKeys)) {
        throw new Error('No Potential Signatures');
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return tr.get_required_signatures(myPubKeys);
    }).then((requiredPubKeys) => {
      _.forEach(requiredPubKeys, (requiredPubKey) => {
        // Get private key pair
        const requiredPrivKey = ii5PrivateKeys[requiredPubKey];
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
    // Notice that sell asset and buy asset has been retrieved before this component is renderred
    // It is because both of them are already binded by BindToChainState
    const sellAsset = this.props.sellAsset; // Core token
    const buyAsset = this.props.buyAsset; // BIT USD
    const sellAssetAmount = 0.0123;
    const buyAssetAmount = 10;
    const accountId = '1.2.153075'; // this is ii-5 account id
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

    // Mark open order in progress
    this.setState({ makeOpenOrderInProgress: true });
    // Process transaction
    this._processTransaction(tr, (success) => {
      // Mark open order in progress finish
      this.setState({ makeOpenOrderInProgress: false });
      if (success) {
        // Refresh order list
        this._getListOfOpenOrders();
      }
    });
  }

  _cancelOrder(orderId) {
    const accountId = '1.2.153075'; // this is ii-5 account id
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

  _onObjectIdTextInputChange(event) {
    const text = event.target.value;
    this.setState({ objectIdTextInputValue: text });
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

  _renderAssetList() {
    return (
      <div>
        {
          this.props.assetList.map( (asset, index) => {
            return (
              <div key={ index }>
                { asset.symbol }
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <b>
          {'DISCLAIMER: THIS TEST PAGE ONLY WORKS IF YOU ARE CONNECTED TO BITSHARES BLOCKCHAIN'}
          </b>
        </div>
        <div>
          {'Welcome To Blockchain! Use your '}<b>{'Chrome Developer Tools\' Console'}</b>{' to see the output'}
        </div>
        <div>
          {'If you want to see how BindToChainState works, pay attention on propTypes, defaultProps, _getAccount(), and BindedBlockchainTestPage '}
        </div>
        <div>------------------------------------------------</div>
        <div>
          <span>
            {'Object Id: '}
          </span>
          <input type='text' name='objectId' value={ this.state.objectIdTextInputValue } onChange={ this._onObjectIdTextInputChange } />
          <Button onClick={ this._getObject } disabled={ !this.state.objectIdTextInputValue || this.state.getObjectInProgress }>
            {'Get Object ' + this.state.objectIdTextInputValue }
          </Button>
        </div>
        <div>------------------------------------------------</div>
        <div>
          <Button onClick={ this._getCurrentBlockchainData }>
            {'Get Object 2.1.0 (Current Blockchain data)'}
          </Button>
        </div>
        <div>
          <Button onClick={ this._getGlobalParameter }>
            {'Get Object 2.0.0 (Blockchain Global Parameter)'}
          </Button>
        </div>
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
          <Button onClick={ this._fetchMarketLimitOrdersInSeries } disabled={ this.state.fetchMarketLimitOrdersInSeriesInProgress }>
            {'Fetch Market Limit Orders in Series'}
          </Button>
        </div>
        <div>
          <Button onClick={ this._fetchMarketLimitOrdersInParallel } disabled={ this.state.fetchMarketLimitOrdersInParallelInProgress }>
            {'Fetch Market Limit Orders in Parallel'}
          </Button>
        </div>
        <div>------------------------------------------------</div>
        <div>
          <Button onClick={ () => { this.props.fetchAssetList('A', 100)} } disabled={ this.state.makeOpenOrderInProgress }>
            {'Get List of Assets and Store it in Redux (Redux demo)'}
          </Button>
        </div>
        <div>
          <Button onClick={ () => { this.props.clearAssetList() } }>
            {'Clear List of Assets from Redux (Redux demo)'}
          </Button>
        </div>
        { this._renderOrderList() }
        { this._renderAssetList() }
      </div>
    );
  }
}

const BindedBlockchainTestPage = BindToChainState()(BlockchainTestPage);
const mapStateToProps = (state) => {
  const { asset } = state;
  return {
    assetList: asset.assetList
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchAssetList: (start, count) => {
      dispatch(AssetActions.fetchAssetList(start, count) );
    },
    clearAssetList: () => {
      dispatch(AssetActions.clearAssetList());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BindedBlockchainTestPage);
