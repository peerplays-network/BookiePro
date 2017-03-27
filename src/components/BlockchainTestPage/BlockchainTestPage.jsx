import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import { ChainStore, FetchChain } from 'graphenejs-lib';
import { Apis } from 'graphenejs-ws';
import { connect } from 'react-redux';
import AssetActions from '../../actions/AssetActions';
import BlockchainTestAccount from './BlockchainTestAccount';
import { AccountActions } from '../../actions';

class BlockchainTestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectIdTextInputValue: '',
      fetchMarketLimitOrdersInSeriesInProgress: false,
      fetchMarketLimitOrdersInParallelInProgress: false,
      getObjectInProgress: false
    };

    this._onObjectIdTextInputChange = this._onObjectIdTextInputChange.bind(this);
    this._getObject = this._getObject.bind(this);
    this._renderAssetList = this._renderAssetList.bind(this);
    this._fetchMarketLimitOrdersInSeries = this._fetchMarketLimitOrdersInSeries.bind(this);
    this._fetchMarketLimitOrdersInParallel = this._fetchMarketLimitOrdersInParallel.bind(this);
    this._onClickInternalApiTestButton = this._onClickInternalApiTestButton.bind(this);
  }

  _onClickInternalApiTestButton() {
    // this.props.dispatch(BetActions.getOngoingBets())
    this.props.dispatch(AccountActions.createLimitOrder('1.3.0', '1.3.1', 1, 1));
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



  _onObjectIdTextInputChange(event) {
    const text = event.target.value;
    this.setState({ objectIdTextInputValue: text });
  }



  _renderAssetList() {
    if (this.props.assetList.length > 0) {
      return (
        <div>
          <div>------------------------------------------------</div>
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
  }

  render() {
    return (
      <div>
        <div>
          <b>
          {'DISCLAIMER: DEFAULT VALUE OF THIS TEST PAGE ONLY WORKS IF YOU ARE CONNECTED TO BITSHARES BLOCKCHAIN'}
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
            <Button onClick={ this._onClickInternalApiTestButton }>
              {'Internal API Test Button'}
            </Button>
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
          <Button onClick={ this._fetchMarketLimitOrdersInSeries } disabled={ this.state.fetchMarketLimitOrdersInSeriesInProgress }>
            {'Fetch Market Limit Orders in Series'}
          </Button>
        </div>
        <div>
          <Button onClick={ this._fetchMarketLimitOrdersInParallel } disabled={ this.state.fetchMarketLimitOrdersInParallelInProgress }>
            {'Fetch Market Limit Orders in Parallel'}
          </Button>
        </div>
        <div>
          <Button onClick={ () => { this.props.fetchAssetList('A', 10)} } disabled={ this.state.makeOpenOrderInProgress }>
            {'Get List of Assets and Store it in Redux (Redux demo)'}
          </Button>
        </div>
        <div>
          <Button onClick={ () => { this.props.clearAssetList() } }>
            {'Clear List of Assets from Redux (Redux demo)'}
          </Button>
        </div>
        { this._renderAssetList() }
        <div>------------------------------------------------</div>
        <BlockchainTestAccount />
        <div>------------------------------------------------</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    assetList: state.getIn(['asset', 'assetList']).toJS()
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchAssetList: (start, count) => {
      dispatch(AssetActions.fetchAssetList(start, count) );
    },
    clearAssetList: () => {
      dispatch(AssetActions.clearAssetList());
    },
    dispatch: (action) => {
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainTestPage);
