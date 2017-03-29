import React, {Component} from 'react';
import { I18n } from 'react-redux-i18n';
import TransactionHistory from './TransactionHistory'
import {
  Row,
  Col,
  Card,
  Input,
  Icon,
  Switch,
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
import dateFormat from 'dateformat';
import { SettingActions,AccountActions } from '../../actions';

const Option = Select.Option;

let isMounted = false;

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

    //To set initial values for start and end change
    var startDate = new Date();
    var endDate = new Date();
    startDate.setDate(startDate.getDate()-6)

    this.state = {
      pagination: true,
      size: 'default',
      scroll: undefined,
      txList: [],

      //Show/Hide date fields based on 'Period' selection
      showDateFields: false,
      //Since, the default period is 'Last 7 days', we set the initial start and end date accordingly
      startDate:dateFormat(startDate, "yyyy-mm-dd h:MM:ss"),
      endDate:dateFormat(endDate, "yyyy-mm-dd h:MM:ss")
    }

    //this.fetchRecentTransactionHistory = this.fetchRecentTransactionHistory.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.handleCurrFormatChange = this.handleCurrFormatChange.bind(this);
    this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
    this.handleNotificationChange = this.handleNotificationChange.bind(this);

    this.periodChange = this.periodChange.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.searchTransactionHistory = this.searchTransactionHistory.bind(this);
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);

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
    isMounted = true;
    this.searchTransactionHistory();
    //this.fetchRecentTransactionHistory();
    //ps.initialize(this.refs.global);
    //ps.update(this.refs.global);
  }

  componentWillUnmount(){
    isMounted = false;
  }
  //Search transaction history with filters
  searchTransactionHistory(e){
    this.props.getTransactionHistory(this.state.startDate, this.state.endDate);
  }

  //Update state for from date whenever it is selected from the calender
  onStartChange = (value) => {
    this.setState({startDate: value.format('YYYY-MM-DD HH:mm:ss')});
  }

  //Update state for to date whenever it is selected from the calender
  onEndChange = (value) => {
    this.setState({endDate: value.format('YYYY-MM-DD HH:mm:ss')});
  }

  //Show the date fields of the user selects 'Custom' from the Period dropdown and update states of the dates accordingly
  periodChange = (value) => {
    if(value === 'custom'){
      this.setState({showDateFields: true});
    }
    else {
      var startDate = new Date();
      switch(value){
        case 'last7Days':
          startDate.setDate(startDate.getDate()-6);
          break;
        case 'last14Days':
          startDate.setDate(startDate.getDate()-13);
          break;
        case 'thisMonth':
          const thisDay = startDate.getDate() - 1;
          //To give me first day of this month
          startDate.setDate(startDate.getDate()-thisDay);
          break;
        case 'lastMonth':
          startDate.setDate(1);
          startDate.setMonth(startDate.getMonth() - 1);
          //Last date of the previous month
          var month = startDate.getMonth();
          var endDate = new Date(startDate.getFullYear(), month + 1, 0);
          break;
        default:
          startDate.setDate(startDate.getDate()-6);
          break;
      }
      this.setState({startDate: dateFormat(startDate, "yyyy-mm-dd h:MM:ss")});
      this.setState({endDate: dateFormat(endDate, "yyyy-mm-dd h:MM:ss")});
      this.setState({showDateFields: false});

    }
  }

  //NOTE: Not removing this code as of now since I will need to refer it later when correct data is obtained
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

  handleRedirectToChangePwd(){
    this.props.redirectToChangePwd();
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
                    checked={ this.props.notification }
                    onChange={ this.handleNotificationChange }/>
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
            onClick={ this.handleRedirectToChangePwd }
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
    const {showDateFields} = this.state;
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

              <p className='text-center margin-tb-30'>
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
          {
            isMounted ?
            <TransactionHistory ref='transHist' transactionHistory={ this.props.transactionHistory }
              currencyFormat={ this.props.currencyFormat } handleSearchClick={ this.searchTransactionHistory }
                periodChange={ this.periodChange } showDateFields={ showDateFields }
                onStartChange={ this.onStartChange } onEndChange={ this.onEndChange }
                startDate={ this.state.startDate } endDate={ this.state.startDate }
              /> :
              null
          }

        </Row>
      </div>
    )
  }
}

const BindedMyAccount = BindToChainState()(MyAccount);

const mapStateToProps = (state) => {
  const setting = state.get('setting');
  return {
    lang: setting.get('lang'),
    timezone: setting.get('timezone'),
    notification: setting.get('notification'),
    currencyFormat: setting.get('currencyFormat'),
    transactionHistory: state.getIn(['account', 'transactionHistories'])
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSettingLang: SettingActions.updateSettingLang,
    updateSettingTimeZone: SettingActions.updateSettingTimeZone,
    updateSettingNotification: SettingActions.updateSettingNotification,
    updateCurrencyFormat: SettingActions.updateCurrencyFormat,
    redirectToChangePwd: SettingActions.redirectToChangePwd,
    getTransactionHistory: AccountActions.getTransactionHistories
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BindedMyAccount);
