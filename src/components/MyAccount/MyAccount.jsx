import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import QRCode from 'qrcode.react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { ChainStore } from 'graphenejs-lib';
import { Button } from 'antd';
import _ from 'lodash';
import { ChainTypes, BindToChainState, BlockchainUtils } from '../../utility';
import ps from "perfect-scrollbar";
import "perfect-scrollbar";

import { Select } from 'antd';
const Option = Select.Option;

import { updateSettingLang,
  updateSettingTimeZone,
  updateSettingNotification,
  updateCurrencyFormat
} from '../../actions/SettingActions'


const columns = [{
  title: 'id',
  dataIndex: 'id',
  key: 'id',
  render: text => <a href='#'>{text}</a>,
}, {
  title: 'op',
  dataIndex: 'op_value',
  key: 'op_value',
  // width: 70, sample of setting width
},  {
  title: 'status',
  dataIndex: 'status',
  key: 'status',
}, {
  title: 'virtual_op',
  dataIndex: 'virtual_op',
  key: 'virtual_op',
}, {
  title: 'time',
  dataIndex: 'tx_time',
  key: 'tx_time',
}, {
  title: 'amount',
  dataIndex: 'amount',
  key: 'amount',
}];

const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';

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
            title,
            showHeader,
            footer,
            scroll: undefined,
            txList : [],
          }

      this.fetchRecentTransactionHistory = this.fetchRecentTransactionHistory.bind(this);
      this.renderTxList = this.renderTxList.bind(this);
      this.handleLangChange = this.handleLangChange.bind(this);
      this.handleCurrFormatChange = this.handleCurrFormatChange.bind(this);
      this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
      this.handleNotificationChange = this.handleNotificationChange.bind(this);


    }

    shouldComponentUpdate(nextProps) {
        // TODO: change in currentformat wont trigger update in of currentformat in table below... still investigating
        // TODO:  last_irreversible_block_num comparision to optimize  shouldComponentUpdate function
        // let {block, dynGlobalObject} = this.props;
        // let  last_irreversible_block_num = dynGlobalObject.get("last_irreversible_block_num" );

        if (nextProps.currencyFormat === this.props.currencyFormat) {
        } else {
          return true;
        }

        if (nextProps.dynGlobalObject === this.props.dynGlobalObject) {
            return false;
        }

        this.fetchRecentTransactionHistory();

        return true;
    }



    componentDidMount() {
      this.fetchRecentTransactionHistory();
      ps.initialize(this.refs.global);
    }


    fetchRecentTransactionHistory() {

      const account = ChainStore.getAccount('1.2.153075'); // this is ii-5 account id

      if (!account) {
        console.log('Fetching data in progress... Please try again in a moment...');
        return;
      }
      this.setState({ fetchRecentHistoryInProgress: true });
      ChainStore.fetchRecentHistory(account.get('id'))
      .then((updatedAccount) => {
        this.setState({ fetchRecentHistoryInProgress: false });

        const txList = updatedAccount.get('history').toJS();
        this.setState({ txList : txList });


        const newTxList = [];
        txList.forEach( order => {

            order.tx_time = ""+BlockchainUtils.calc_block_time(order.block_num, this.props.globalObject, this.props.dynGlobalObject)
            order.history = 'history';
            order.amount = order.op[1].fee.amount + " " + this.props.currencyFormat;
            order.op_value = order.op[0] + " op";

            let last_irreversible_block_num = this.props.dynGlobalObject.get("last_irreversible_block_num" );
            let status = "completed";
            if( order.block_num > last_irreversible_block_num ) {
               status =  (order.block_num - last_irreversible_block_num) + "imcomplete";
            }
            order.status = status;


            newTxList.push(order);
        });

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
              <Table {  ...this.state  } columns={  columns  } dataSource={  this.state.txList  } rowKey='id'
              ref='table'/>

            </div>
          </Card>
          </Col>
        );
      }
      return null;
    }


    handleNotificationChange(value) {
      const { updateSettingNotification } = this.props
      updateSettingNotification(value)
    }

    handleLangChange(value){
      const { updateSettingLang } = this.props
      updateSettingLang(value)
    }

    handleCurrFormatChange(value){
      const { updateCurrencyFormat } = this.props
      updateCurrencyFormat(value)

      // still fixing table reload
      // this.setState({
      //      txList: this.props.txList
      // })
    }

    handleTimeZoneChange(value){
      const { updateSettingTimeZone } = this.props
      updateSettingTimeZone(value)

    }

    renderSettingCard(){


        return (

          <Card title='Settings' bordered={ false } style={ { width: '100%' } } >
            <p>{ this.props.currencyFormat }</p>
            <div
              style={ { height: '133px'} }
              ref='global_object'
              >


                <Select size='large' defaultValue={ this.props.timezone } style={ { width: 200 } } onChange={ this.handleTimeZoneChange }>
                     <Option value='UTC-12:00'>UTC-12:00</Option>
                     <Option value='UTC-11:00'>UTC-11:00</Option>
                     <Option value='UTC-10:00'>UTC-10:00</Option>
                     <Option value='UTC-05:00'>UTC-05:00</Option>
                     <Option value='UTC-03:00'>UTC-03:00</Option>
                     <Option value='UTC-02:00'>UTC-02:00</Option>
                     <Option value='UTC-01:00'>UTC-01:00</Option>
                     <Option value='UTC+00:00'>UTC+00:00</Option>
                     <Option value='UTC+07:00'>UTC07:00</Option>
                     <Option value='UTC+08:00'>UTC+08:00</Option>
                     <Option value='UTC+09:00'>UTC+09:00</Option>
                 </Select>
                 <Select defaultValue={ this.props.lang } style={ { width: 200 } } onChange={ this.handleLangChange }>
                   <Option value='zh-hk'>chinese </Option>
                   <Option value='en-us'>English</Option>
                 </Select>
                 <Select size='large' defaultValue={ this.props.notification } style={ { width: 200 } } onChange={ this.handleNotificationChange }>
                   <Option value='ON'>ON</Option>
                   <Option value='OFF'>OFF</Option>
                 </Select>
                 <Select size='large' defaultValue={ this.props.currencyFormat } style={ { width: 200 } } onChange={ this.handleCurrFormatChange }>
                   <Option value='BTC'>BTC</Option>
                   <Option value='mBTC'>mBTC</Option>
                 </Select>

            </div>
            <p>Card content</p>


          </Card>
        );
    }

    render() {

      return (
        <div style={ { 'padding' : '5px' } }
          >
          <Row>
          <Col span={ 8 } style={ { 'padding' : '5px' } }>
            <Card title='Deposit' bordered={ false } style={ { width: '100%' } }>
              <p>Card content</p>
              <p>
                <div>
              { JSON.stringify(this.props.dynGlobalObject) }
                </div>
              </p>
              <p><QRCode value='http://facebook.github.io/react/' /></p>
            </Card>
          </Col>

          <Col span={ 8 } style={ { 'padding' : '5px' } }>
            <Card title='Withdraw' bordered={ false } style={ { width: '100%' } }>
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
              { this.renderSettingCard() }
          </Col>
        </Row>
      <Row>
        <div
          >
          { this.renderTxList() }
        </div>
      </Row>



        </div>
      )
    }
}

const BindedMyAccount = BindToChainState()(MyAccount);

const mapStateToProps = (state) => {
  const { setting } = state;
  return {
    lang: setting.lang,
    timezone: setting.timezone,
    notification: setting.notification,
    currencyFormat: setting.currencyFormat,
  }
}


function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSettingLang: updateSettingLang,
    updateSettingTimeZone: updateSettingTimeZone,
    updateSettingNotification: updateSettingNotification,
    updateCurrencyFormat: updateCurrencyFormat,
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BindedMyAccount);
