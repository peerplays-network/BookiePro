import React, {Component} from 'react';
var I18n = require('react-redux-i18n').I18n;
import TransactionHistory from './TransactionHistory'
import {
  Row,
  Col,
  Card,
  Input,
  Icon,
  Switch,
  Table,
  DatePicker,
  Select,
  Breadcrumb
} from 'antd';
import QRCode from 'qrcode.react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import './MyAccount.less'
import {ChainStore} from 'graphenejs-lib';
import _ from 'lodash';
import {
  ChainTypes,
  BindToChainState,
  BlockchainUtils
} from '../../utility';
import ps from 'perfect-scrollbar';
import 'perfect-scrollbar';

const dataSource = [
  {
    key: '1',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='processed'>Processing</span>,
    'amount': 1.31
  },
  {
    key: '2',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='completed'>Completed</span>,
    'amount': 1.31
  },
  {
    key: '3',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='processed'>Processing</span>,
    'amount': 1.31
  },
  {
    key: '4',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='processed'>Processing</span>,
    'amount': 1.31
  },
  {
    key: '5',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='completed'>Completed</span>,
    'amount': 1.31
  },
  {
    key: '6',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='processed'>Processing</span>,
    'amount': 1.31
  },
  {
    key: '7',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='completed'>Completed</span>,
    'amount': 1.31
  },
  {
    key: '8',
    id: 'TX#0000014',
    'time': '19/01/2017 02:33:02',
    'desc': 'Deposit',
    'status': <span
      className='completed'>Completed</span>,
    'amount': 1.31
  }
];

const columns = [
  {
    title: I18n.t('myAccount.id'),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: I18n.t('myAccount.time'),
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: I18n.t('myAccount.description'),
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: I18n.t('myAccount.status'),
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: I18n.t('myAccount.amount'),
    dataIndex: 'amount',
    key: 'amount',
  }
];
const Option = Select.Option;
function onChange(checked) {
  console.log(`switch to ${checked}`);
}

import { SettingActions,TransHistActions } from '../../actions';


const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';

class MyAccount extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
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
      txList: [],
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
    // let  last_irreversible_block_num = dynGlobalObject.get('last_irreversible_block_num' );

    if (nextProps.currencyFormat === this.props.currencyFormat) {
    } else {
      return true;
    }

    if (nextProps.dynGlobalObject === this.props.dynGlobalObject) {
      return false;
    }

    //this.fetchRecentTransactionHistory();

    return true;
  }


  componentDidMount() {
    this.props.getTransactionHistory();
    //this.fetchRecentTransactionHistory();
    //ps.initialize(this.refs.global);

    //ps.update(this.refs.global);
  }


  fetchRecentTransactionHistory() {

    const account = ChainStore.getAccount('1.2.153075'); // this is ii-5 account id

    if (!account) {
      console.log('Fetching data in progress... Please try again in a moment...');
      return;
    }
    this.setState({fetchRecentHistoryInProgress: true});
    ChainStore.fetchRecentHistory(account.get('id'))
      .then((updatedAccount) => {
        this.setState({fetchRecentHistoryInProgress: false});

        const txList = updatedAccount.get('history').toJS();
        this.setState({txList: txList});


        const newTxList = [];
        txList.forEach(order => {

          order.tx_time = '' + BlockchainUtils.calc_block_time(order.block_num, this.props.globalObject, this.props.dynGlobalObject)
          order.history = 'history';
          order.amount = order.op[1].fee.amount + ' ' + this.props.currencyFormat;
          order.op_value = order.op[0] + ' op';

          let last_irreversible_block_num = this.props.dynGlobalObject.get('last_irreversible_block_num');
          let status = 'completed';
          if (order.block_num > last_irreversible_block_num) {
            status = (order.block_num - last_irreversible_block_num) + 'imcomplete';
          }
          order.status = status;


          newTxList.push(order);
        });

        this.setState({txList: newTxList});
        ps.update(this.refs.global);

      });
  }


  renderTxList() {
    if (!_.isEmpty(this.state.txList)) {
      return (
        <Col span={ 24 }
             style={ {'padding': '5px'} }>
          <Card title='Card title'
                bordered={ false }
                style={ {width: '100%'} }>

            <div style={ {
              'height': '500px',
              'overflow': 'auto',
              'overflow-x': 'hidden'
            } }
                 ref='global'
            >
              <Table {  ...this.state  }
                     columns={  columns  }
                     dataSource={  this.state.txList  }
                     rowKey='id'
                     ref='table'/>

            </div>
          </Card>
        </Col>
      );
    }
    return null;
  }


  handleNotificationChange(value) {
    const {updateSettingNotification} = this.props
    updateSettingNotification(value)
  }

  handleLangChange(value) {
    const {updateSettingLang} = this.props
    updateSettingLang(value)
  }

  handleCurrFormatChange(value) {
    const {updateCurrencyFormat} = this.props
    updateCurrencyFormat(value)

    // still fixing table reload
    // this.setState({
    //      txList: this.props.txList
    // })
  }

  handleTimeZoneChange(value) {
    const {updateSettingTimeZone} = this.props
    updateSettingTimeZone(value)

  }

  getTransactionHistory(){
    console.log("data?");
    console.log(this.props.transactionHistory);

  }

  renderSettingCard() {


    return (
      <Card className='bookie-card'
            title={ I18n.t('myAccount.settings') }
            bordered={ false }
            style={ {width: '100%'} }>
        <Row>
          <Col span={ 18 }>
            <p> { I18n.t('myAccount.notifications') }</p>
          </Col>
          <Col span={ 6 }>
            <Switch className='bookie-switch'
                    defaultChecked={ false }
                    onChange={ onChange }/>
          </Col>
        </Row>
        <Row className='margin-tb-15'>
          <Col span={ 18 }>
            <p
              className='padding-tb-5'> { I18n.t('myAccount.time_zone') }</p>
          </Col>
          <Col span={ 6 }>
            <div ref='global_object'>
              <Select
                className='bookie-select'
                defaultValue={ this.props.timezone }
                onChange={ this.handleTimeZoneChange }>
                <Option
                  value='UTC-12:00'>{ I18n.t('myAccount.UTC_12') }</Option>
                <Option
                  value='UTC-11:00'>{ I18n.t('myAccount.UTC_11') }</Option>
                <Option
                  value='UTC-10:00'>{ I18n.t('myAccount.UTC_10') }</Option>
                <Option
                  value='UTC-09:00'>{ I18n.t('myAccount.UTC_9') }</Option>
                <Option
                  value='UTC-08:00'>{ I18n.t('myAccount.UTC_8') }</Option>
                <Option
                  value='UTC-07:00'>{ I18n.t('myAccount.UTC_7') }</Option>
                <Option
                  value='UTC-06:00'>{ I18n.t('myAccount.UTC_6') }</Option>
                <Option
                  value='UTC-05:00'>{ I18n.t('myAccount.UTC_5') }</Option>
                <Option
                  value='UTC-04:00'>{ I18n.t('myAccount.UTC_4') }</Option>
                <Option
                  value='UTC-03:00'>{ I18n.t('myAccount.UTC_3') }</Option>
                <Option
                  value='UTC-02:00'>{ I18n.t('myAccount.UTC_2') }</Option>
                <Option
                  value='UTC-01:00'>{ I18n.t('myAccount.UTC_1') }</Option>
                <Option
                  value='UTC+00:00'>{ I18n.t('myAccount.UTC0') }</Option>
                <Option
                  value='UTC+01:00'>{ I18n.t('myAccount.UTC1') }</Option>
                <Option
                  value='UTC+02:00'>{ I18n.t('myAccount.UTC2') }</Option>
                <Option
                  value='UTC+03:00'>{ I18n.t('myAccount.UTC3') }</Option>
                <Option
                  value='UTC+04:00'>{ I18n.t('myAccount.UTC4') }</Option>
                <Option
                  value='UTC+05:00'>{ I18n.t('myAccount.UTC5') }</Option>
                <Option
                  value='UTC+06:00'>{ I18n.t('myAccount.UTC6') }0</Option>
                <Option
                  value='UTC+07:00'>{ I18n.t('myAccount.UTC7') }</Option>
                <Option
                  value='UTC+08:00'>{ I18n.t('myAccount.UTC8') }</Option>
                <Option
                  value='UTC+09:00'>{ I18n.t('myAccount.UTC9') }</Option>
                <Option
                  value='UTC+10:00'>{ I18n.t('myAccount.UTC10') }</Option>
                <Option
                  value='UTC+11:00'>{ I18n.t('myAccount.UTC11') }</Option>
                <Option
                  value='UTC+12:00'>{ I18n.t('myAccount.UTC12') }</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row className='margin-tb-15'>
          <Col span={ 18 }>
            <p
              className='padding-tb-5'>{ I18n.t('myAccount.format') }</p>
          </Col>
          <Col span={ 6 }>
            <div ref='global_object'>
              <Select
                className='bookie-select'
                defaultValue='BTC'
                onChange={ this.handleTimeZoneChange }>
                <Option value='UTC-12:00'> BTC</Option>
                <Option value='UTC-11:00'>mBTC</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row
          className='margin-tb-15 registerComponent'>
          <button
            className='btn btn-primary margin-tb-15'>
            { I18n.t('myAccount.change_password') }
          </button>
          <button className='btn btn-primary'>
            { I18n.t('myAccount.create_recovery_file') }
          </button>
        </Row>
      </Card>
    );
  }

  render() {
    const {startValue, endValue} = this.state;
    return (
      <div className='my-account'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a
            href='/'>  {I18n.t('myAccount.home')} </a></Breadcrumb.Item>
          <Breadcrumb.Item>{I18n.t('myAccount.my_account')}</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={ 10 }>
          <Col span={ 8 }>
            <Card className='bookie-card'
                  title={ I18n.t('myAccount.deposit') }
                  bordered={ false }
                  style={ {width: '100%'} }>
              <p>{ I18n.t('myAccount.deposit_desc') }</p>
              <p>

                {/*{ JSON.stringify(this.props.dynGlobalObject) }*/}

              </p>

              <p className='text-center margin-tb-20'>
                <QRCode
                  value='http://facebook.github.io/react/'/>
              </p>
              <div
                className='registerComponent pos-relative'>
                <Input
                  className='bookie-input'
                  defaultValue='163WXbtyK3xrGEFhprM9JgzbZSyCKnc3AC'

                />
                <button
                  className='btn btn-primary copy-btn'>
                  { I18n.t('myAccount.copy') }
                </button>
              </div>
            </Card>
          </Col>

          <Col span={ 8 }>
            <Card className='bookie-card'
                  title={ I18n.t('myAccount.withdraw') }
                  bordered={ false }
                  style={ {width: '100%'} }>
              <p>{ I18n.t('myAccount.withdraw_desc') }</p>
              {/*<p style={ { height: '133px' } }>*/}
              {/*<Button   onClick={ () => { this.fetchRecentTransactionHistory(); } }>*/}
              {/*{'refresh Order'}*/}
              {/*</Button>*/}
              {/*</p>*/}
              <div
                className='registerComponent'>
                <Input
                  className='bookie-input bookie-amount'
                  prefix={ <Icon
                    type='pay-circle'/> }
                  defaultValue='21221'
                />
              </div>
              <div
                className='registerComponent pos-relative'>

                <Input
                  className='bookie-input'
                  placeholder={ I18n.t('myAccount.send_value') }
                />
                <button
                  className='btn copy-btn btn-primary'>
                  { I18n.t('myAccount.send') }
                </button>
              </div>

            </Card>
          </Col>

          <Col span={ 8 }>
            { this.renderSettingCard() }
          </Col>
        </Row>
        <Row>
          {/*<div*/}
          {/*>*/}
          {/*{ this.renderTxList() }*/}
          {/*</div>*/}

          <TransactionHistory transactionHistory={ this.props.transactionHistory }
            currencyFormat={ this.props.currencyFormat }
            />

        </Row>


      </div>
    )
  }
}

const BindedMyAccount = BindToChainState()(MyAccount);

const mapStateToProps = (state) => {
  const {setting} = state;
  return {
    lang: setting.lang,
    timezone: setting.timezone,
    notification: setting.notification,
    currencyFormat: setting.currencyFormat,
    transactionHistory: state.transHistory.transactionHistory
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSettingLang: SettingActions.updateSettingLang,
    updateSettingTimeZone: SettingActions.updateSettingTimeZone,
    updateSettingNotification: SettingActions.updateSettingNotification,
    updateCurrencyFormat: SettingActions.updateCurrencyFormat,
    getTransactionHistory: TransHistActions.getTransactionHistory
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BindedMyAccount);
