import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import QRCode from 'qrcode.react';
import { Table } from 'antd';
// import { Scrollbars } from 'react-custom-scrollbars';
import { ChainStore } from 'graphenejs-lib';
import { Button } from 'antd';
import _ from 'lodash';
// import Immutable from 'immutable';
import { ChainTypes, BindToChainState, BlockchainUtils } from '../../utility';
// import { connect } from 'react-redux';
import ps from "perfect-scrollbar";
import "perfect-scrollbar";
// let {operations} = require("graphenejs-lib").ChainTypes;
// let ops = Object.keys(operations);

const columns = [{
  title: 'id',
  dataIndex: 'id',
  key: 'id',
  // width: 150,
  render: text => <a href='#'>{text}</a>,
}, {
  title: 'op',
  dataIndex: 'op_value',
  key: 'op_value',
  // width: 70,
},  {
  title: 'status',
  dataIndex: 'status',
  key: 'status',
  // width: 70,
}, {
  title: 'virtual_op',
  dataIndex: 'virtual_op',
  key: 'virtual_op',
  // width: 70,
}, {
  title: 'time',
  dataIndex: 'tx_time',
  key: 'tx_time',
}, {
  title: 'amount',
  dataIndex: 'amount',
  key: 'amount',
}];

const expandedRowRender = record => <p>{record.id}</p>;
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };




class MyAccount extends Component {

    static propTypes = {
      dynGlobalObject: ChainTypes.ChainObject.isRequired,
      globalObject: ChainTypes.ChainObject.isRequired,
    };

    static defaultProps = {
        dynGlobalObject: '2.1.0',
        globalObject: '2.0.0',

    };

    constructor(props) {
      super(props);
      this.state = {
            bordered: false,
            loading: false,
            pagination: true,
            size: 'default',
            // expandedRowRender,
            title,
            showHeader,
            footer,
            // rowSelection: {},
            scroll: undefined,
            txList : [],
          }

      this.fetchRecentTransactionHistory = this.fetchRecentTransactionHistory.bind(this);
      this.renderTxList = this.renderTxList.bind(this);

    }

    shouldComponentUpdate(nextProps) {
        console.log(" should component update");
        let {block, dynGlobalObject} = this.props;
        let last_irreversible_block_num = dynGlobalObject.get("last_irreversible_block_num" );
        if (nextProps.dynGlobalObject === this.props.dynGlobalObject) {
            return false;
        }

        this.fetchRecentTransactionHistory();

          return true;
    }

    componentDidMount() {
      console.log('component did mount');
      const { dispatch } = this.props;
      this.fetchRecentTransactionHistory();
      ps.initialize(this.refs.global);

      // ps.initialize(this.refs.global_object);
      // ps.initialize(this.refs.dyn_global_object);
      // ps.initialize(this.refs.global);

    }

    // calcTime(block_number) {
        // this.setState({time: BlockchainUtils.calc_block_time(block_number, this.props.globalObject, this.props.dynGlobalObject)});
    // }

    fetchRecentTransactionHistory() {
      // console.log('fetchRecentTransactionHistory');

      // It seems to fetch transaction history, one needs to have account stored in ChainStore cache first
      const account = ChainStore.getAccount('1.2.153075'); // this is ii-5 account id

      if (!account) {
        console.log('Fetching data in progress... Please try again in a moment...');
        return;
      }
      this.setState({ fetchRecentHistoryInProgress: true });
      // Unlike getObject or get Asset, fetchRecentHistory returns a Promise....
      // Honestly, I don't like this inconsistency... ._.
      ChainStore.fetchRecentHistory(account.get('id'))
      .then((updatedAccount) => {
        this.setState({ fetchRecentHistoryInProgress: false });
        // console.log('Transaction History:', updatedAccount.get('history').toJS());

        const txList = updatedAccount.get('history').toJS();
        // Store order inside internal state
        this.setState({ txList : txList });


        const newTxList = [];
        txList.forEach( order => {

            order.tx_time = ""+BlockchainUtils.calc_block_time(order.block_num, this.props.globalObject, this.props.dynGlobalObject)
            order.history = 'history';
            order.amount = order.op[1].fee.amount + " mBTS";
            order.op_value = order.op[0] + " op";

            let last_irreversible_block_num = this.props.dynGlobalObject.get("last_irreversible_block_num" );
            let status = "completed";
            if( order.block_num > last_irreversible_block_num ) {
               status =  (order.block_num - last_irreversible_block_num) + "imcomplete";
            }
            order.status = status;


            newTxList.push(order);
            // return  b
        });

        console.log(newTxList);
        this.setState({ txList : newTxList });
        ps.update(this.refs.global);

      });
    }


    renderTxList() {
      if (!_.isEmpty(this.state.txList)) {
        return (
          <Col span={ 24 } style={ { 'padding' : '5px' } }>
            <Card title='Card title' bordered={ false } style={ { width: '100%' } }>

            <div style={ { 'height' : '500px', 'overflow' : 'auto', 'overflow-x': 'hidden' } }
              ref='global'
              >
              <Table {  ...this.state  } columns={  columns  } dataSource={  this.state.txList  }
              ref='table'/>

            </div>
          </Card>
          </Col>
        );
      }
      return null;
    }

    render() {

      return (
        // <Scrollbars
        //          style={ { height: 733 } }>
        <div style={ { 'padding' : '5px' } }
          >
          <Row>
          <Col span={ 8 } style={ { 'padding' : '5px' } }>
            <Card title='Card title' bordered={ false } style={ { width: '100%' } }>
              <p>Card content</p>
              <p>Card content</p>
              <p><QRCode value='http://facebook.github.io/react/' /></p>
            </Card>
          </Col>

          <Col span={ 8 } style={ { 'padding' : '5px' } }>
            <Card title='Card title' bordered={ false } style={ { width: '100%' } }>
              <p>Card content</p>
              <p>Card content</p>
              <p style={ { height: '133px' } }>
                <Button   onClick={ () => { this.fetchRecentTransactionHistory(); } }>
                  {'refresh Order'}
                </Button>
              </p>


            </Card>
          </Col>

          <Col span={ 8 } style={ { 'padding' : '5px' } }>
            <Card title='Card title' bordered={ false } style={ { width: '100%' } } >
              <p>Card content</p>
              <div
                style={ { height: '133px'} }
                ref='global_object'
                >
                  <div>
              { JSON.stringify(this.props.dynGlobalObject) }
                </div>
              </div>
              <p>Card content</p>


            </Card>
          </Col>
        </Row>
      <Row>
        <div
          >
          { this.renderTxList() }
        </div>
      </Row>



        </div>
        //  </Scrollbars>
      )
    }
}

const BindedMyAccount = BindToChainState()(MyAccount);

const mapStateToProps = (state) => {
  //Mock implementation
  return {
    accountName: 'ii-5'
  }
}
export default BindedMyAccount;
