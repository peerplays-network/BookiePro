import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import { Apis } from 'graphenejs-ws';
import { connect } from 'react-redux';
import TestBookieAccount from './TestBookieAccount';
import { AccountActions } from '../../actions';
import BannerClock from '../Banners/BannerClock';

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
    this._fetchMarketLimitOrdersInParallel = this._fetchMarketLimitOrdersInParallel.bind(this);
    this._onClickInternalApiTestButton = this._onClickInternalApiTestButton.bind(this);
  }

  _onClickInternalApiTestButton() {
    this.props.dispatch(AccountActions.createLimitOrder());
    // this.props.dispatch(BetActions.getOngoingBets())
    // this.props.dispatch(AccountActions.changePassword('DgTdQBzqF1NLnniikZuoedoWYzVHjJmV28LS7PJAqWdkwRkWzkyq', 'DgTdQBzqF1NLnniikZuoedoWYzVHjJmV28LS7PJAqWdkwRkWzkyq'));
    // Apis.instance().db_api().exec("get_full_accounts", [["1.2.152"],true]).then( results => {
    //   console.log('full accounts', results);
    // });

  }

  _getObject() {
    this.setState({ getObjectInProgress: true });
    const objectId = this.state.objectIdTextInputValue;
    Apis.instance().db_api().exec("get_objects", [[objectId]]).then((result) => {
      const object = result[0];
      if (object === null) {
        console.log('No such object');
      } else {
        console.log('Object ', objectId + ':\n', object);
      }
    }).catch((error) => {
      console.log('CAUGHT AN ERROR');
      console.error(error);
    }).then(() => {
      this.setState({ getObjectInProgress: false });
    })
  }

  _fetchMarketLimitOrdersInParallel() {
    // Demonstrate the speed of fetching 10 market orders in parallel
    this.setState( { fetchMarketLimitOrdersInParallelInProgress: true });
    Promise.all([
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.1', 20]),
      Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.2', 10]),
    ]).then((values) => {
      let marketLimitOrders = [];
      for(let i = 0; i < values.length; i++) {
        marketLimitOrders = _.concat(marketLimitOrders, values[i]);
      }
      this.setState({ fetchMarketLimitOrdersInParallelInProgress: false });
    })
  }


  _onObjectIdTextInputChange(event) {
    const text = event.target.value;
    this.setState({ objectIdTextInputValue: text });
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
          <input type='text' name='objectId' value={ this.state.objectIdTextInputValue } onChange={ this._onObjectIdTextInputChange } style={ {  'background':'black'} }/>
          <Button onClick={ this._getObject } disabled={ !this.state.objectIdTextInputValue || this.state.getObjectInProgress }>
            {'Get Object ' + this.state.objectIdTextInputValue }
          </Button>
        </div>
        <div>------------------------------------------------</div>
        <div>
          <Button onClick={ this._fetchMarketLimitOrdersInParallel } disabled={ this.state.fetchMarketLimitOrdersInParallelInProgress }>
            {'Fetch Market Limit Orders in Parallel'}
          </Button>
        </div>
        <div>------------------------------------------------</div>
        <TestBookieAccount account={ this.props.account }/>
        <div>------------------------------------------------</div>
        <BannerClock />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.getIn(['account', 'account'])
  };
}

export default connect(mapStateToProps, null)(BlockchainTestPage);
