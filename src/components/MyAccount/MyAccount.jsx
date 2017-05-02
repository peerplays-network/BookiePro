import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import TransactionHistory from './TransactionHistory'
import {
  Row,
  Col,
  Card,
  Switch,
  Select,
  Breadcrumb
} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import './MyAccount.less'
import _ from 'lodash';
import { BlockchainUtils } from '../../utility';
import { CommunicationService } from '../../services';
import ps from 'perfect-scrollbar';
import 'perfect-scrollbar';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import moment from 'moment';
import { SettingActions,AccountActions } from '../../actions';
import { LoadingStatus } from '../../constants';
import { saveAs } from '../../utility/fileSaver.js';

const Option = Select.Option;

class MyAccount extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      pagination: true,
      size: 'default',
      scroll: undefined,
      txList: [],
      //Show/Hide date fields based on 'Period' selection
      showDateFields: false,
      //Since, the default period is 'Last 7 days', we set the initial 'From' and 'To' dates accordingly
      fromDate: moment().subtract(6, 'days'),
      toDate: moment(),
      withdrawAmount:'',
      exportButtonClicked: false
    }

    // this.fetchRecentTransactionHistory = this.fetchRecentTransactionHistory.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.handleCurrFormatChange = this.handleCurrFormatChange.bind(this);
    this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
    this.handleNotificationChange = this.handleNotificationChange.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);

    this.periodChange = this.periodChange.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.searchTransactionHistory = this.searchTransactionHistory.bind(this);
    this.exportTransactionHistory = this.exportTransactionHistory.bind(this);
    this.resetTransactionHistoryExportLoadingStatus = this.resetTransactionHistoryExportLoadingStatus.bind(this);
    this.clearTransactionHistoryExport = this.clearTransactionHistoryExport.bind(this);
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);
    this.renderSettingCard = this.renderSettingCard.bind(this);
    this.handleDownloadPasswordFile = this.handleDownloadPasswordFile.bind(this);


  }


  /*shouldComponentUpdate(nextProps) {
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
  }*/

  componentDidMount() {
    this.searchTransactionHistory();
    // this.fetchRecentTransactionHistory();
    //ps.initialize(this.refs.global);
    //ps.update(this.refs.global);

    //Get the deposit address
    this.props.getDepositAddress();
  }

  //Disable out of range dates for 'From Date'
  disabledFromDate = (fromValue) => {
    const toValue = this.state.toDate;
    if (!fromValue || !toValue) {
      return false;
    }
    return fromValue.valueOf() > toValue.valueOf();
  }

  //Disable out of range dates for 'To Date'
  disabledToDate = (toValue) => {
    const fromValue = this.state.fromDate;
    if (!toValue || !fromValue) {
      return false;
    }
    return toValue.valueOf() <= fromValue.valueOf();
  }

  //Search transaction history with filters
  searchTransactionHistory(){
    //Format from date and to date in the required format and pass
    this.props.getTransactionHistory(this.state.fromDate.format("YYYY-MM-DD HH:mm:ss"),
               this.state.toDate.format("YYYY-MM-DD HH:mm:ss"));
  }

  //Export transaction history
  exportTransactionHistory(event){
    event.preventDefault();
    //To show export related status after the 'Export' button is clicked
    this.setState({ exportButtonClicked: true });
    this.props.getTransactionHistoryExport(this.state.fromDate.format("YYYY-MM-DD HH:mm:ss"),
               this.state.toDate.format("YYYY-MM-DD HH:mm:ss"));
  }

  //Cancel transaction history export - Resetting it's loading status to 'default'
  resetTransactionHistoryExportLoadingStatus(){
    this.props.resetTransactionHistoryExportLoadingStatus();
    this.setState({ exportButtonClicked: false });
  }

  //Clear transaction history export data after downloading it to release memory
  clearTransactionHistoryExport(){
    this.props.clearTransactionHistoryExport();
  }

  //Update state for 'from date' whenever it is selected from the calender
  onStartChange = (value) => {
    this.setState({ fromDate:value });
  }

  //Update state for 'to date' whenever it is selected from the calender
  onEndChange = (value) => {
    this.setState({ toDate:value });
  }

  //Show the date fields of the user selects 'Custom' from the Period dropdown and update states of the dates accordingly
  periodChange = (value) => {
    if(value === 'custom'){
      //Date would set set on selection from the datepicker
      this.setState({ showDateFields: true,fromDate: null,toDate: null });
    }
    else {
      let fromDate;
      this.setState({ toDate: moment() });
      switch(value){
        case 'last7Days':default:
          //Subtract 6 days from the current day
          fromDate = moment().subtract(6, 'days');
          break;
        case 'last14Days':
          //Subtract 14 days from the current day
          fromDate = moment().subtract(13, 'days');
          break;
        case 'thisMonth':
          //First of the current month, 12:00 am
          fromDate = moment().startOf('month');
          break;
        case 'lastMonth':
          //Last month's 1st day
          fromDate = moment().subtract(1, 'months').startOf('month');
          //Last month's last day
          this.setState({toDate: moment().subtract(1, 'months').endOf('month')});
          break;
      }
      this.setState({ fromDate: fromDate });
      this.setState({ showDateFields: false });
    }
  }

  //NOTE: Not removing this code as of now since I will need to refer it later when correct data is obtained
  fetchRecentTransactionHistory() {

    const account = this.props.account;
    const accountId = account.get('id');
    if (!accountId) {
      console.log('No account');
      return;
    }
    this.setState({fetchRecentHistoryInProgress: true});
    CommunicationService.fetchRecentHistory(accountId)
      .then((result) => {
        this.setState({fetchRecentHistoryInProgress: false});

        const txList = result.toJS();
        this.setState({txList: txList});

        const newTxList = [];
        txList.forEach(order => {

          order.tx_time = '' + BlockchainUtils.calcBlockTime(order.block_num, this.props.globalObject, this.props.dynGlobalObject)
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

  handleWithdrawSubmit(values){
    //track the withdraw amount to display in success message after successful submit
    this.setState({ withdrawAmount:values.get('withdrawAmount') });
    this.props.withdraw(values.get('withdrawAmount'), values.get('walletAddr'));
  }

  //Download the password in a text file
  handleDownloadPasswordFile() {
    let blob = new Blob([ this.props.password ], {
      type: 'text/plain'
    });
    saveAs(blob, 'account-recovery-file.txt');
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
                    defaultChecked={ this.props.notification }
                    onChange={ this.handleNotificationChange }/>
          </Col>
        </Row>
        {/*<Row className='margin-tb-15'>*/}
          {/*<Col span={ 18 }>*/}
            {/*<p*/}
              {/*className='padding-tb-5'> { I18n.t('myAccount.time_zone') }</p>*/}
          {/*</Col>*/}
          {/*<Col span={ 6 }>*/}
            {/*<div ref='global_object'>*/}
              {/*<Select*/}
                {/*className='bookie-select'*/}
                {/*defaultValue={ this.props.timezone }*/}
                {/*onChange={ this.handleTimeZoneChange }>*/}
                {/*<Option*/}
                  {/*value='UTC-12:00'>{ I18n.t('myAccount.UTC_12') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-11:00'>{ I18n.t('myAccount.UTC_11') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-10:00'>{ I18n.t('myAccount.UTC_10') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-09:00'>{ I18n.t('myAccount.UTC_9') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-08:00'>{ I18n.t('myAccount.UTC_8') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-07:00'>{ I18n.t('myAccount.UTC_7') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-06:00'>{ I18n.t('myAccount.UTC_6') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-05:00'>{ I18n.t('myAccount.UTC_5') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-04:00'>{ I18n.t('myAccount.UTC_4') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-03:00'>{ I18n.t('myAccount.UTC_3') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-02:00'>{ I18n.t('myAccount.UTC_2') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC-01:00'>{ I18n.t('myAccount.UTC_1') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+00:00'>{ I18n.t('myAccount.UTC0') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+01:00'>{ I18n.t('myAccount.UTC1') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+02:00'>{ I18n.t('myAccount.UTC2') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+03:00'>{ I18n.t('myAccount.UTC3') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+04:00'>{ I18n.t('myAccount.UTC4') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+05:00'>{ I18n.t('myAccount.UTC5') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+06:00'>{ I18n.t('myAccount.UTC6') }0</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+07:00'>{ I18n.t('myAccount.UTC7') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+08:00'>{ I18n.t('myAccount.UTC8') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+09:00'>{ I18n.t('myAccount.UTC9') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+10:00'>{ I18n.t('myAccount.UTC10') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+11:00'>{ I18n.t('myAccount.UTC11') }</Option>*/}
                {/*<Option*/}
                  {/*value='UTC+12:00'>{ I18n.t('myAccount.UTC12') }</Option>*/}
              {/*</Select>*/}
            {/*</div>*/}
          {/*</Col>*/}
        {/*</Row>*/}
        <Row className='margin-tb-15'>
          <Col span={ 18 }>
            <p
              className='padding-tb-5'>{ I18n.t('myAccount.format') }</p>
          </Col>
          <Col span={ 6 }>
            <div ref='global_object'>
              <Select
                className='bookie-select'
                defaultValue={ this.props.currencyFormat }
                onChange={ this.handleCurrFormatChange }>
                <Option value='BTC'> BTC</Option>
                <Option value='mBTC'>mBTC</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <div className='bottom-div'>
          <Row
            className='registerComponent'>
            <button
              onClick={ this.handleRedirectToChangePwd }
              className='btn btn-primary margin-tb-30'>
              { I18n.t('myAccount.change_password') }
            </button>
            <button className='btn btn-primary'
              onClick={ this.handleDownloadPasswordFile }>
              { I18n.t('myAccount.create_recovery_file') }
            </button>
          </Row>
        </div>

      </Card>
    );
  }

  render() {
    return (
      <div className='my-account section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a
            href='/'>  {I18n.t('myAccount.home')} </a></Breadcrumb.Item>
          <Breadcrumb.Item>{I18n.t('myAccount.my_account')}</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={ 20 }>
          <Col span={ 8 }>
            <Deposit cardClass='bookie-card' depositAddress={ this.props.depositAddress }/>
          </Col>
          <Col span={ 8 }>
            <Withdraw cardClass='bookie-card'
              currencyFormat={ this.props.currencyFormat }
              precision={ this.props.precision }
              availableBalance={ this.props.availableBalance }
              onSubmit={ this.handleWithdrawSubmit }
              withdrawLoadingStatus={ this.props.withdrawLoadingStatus }
              withdrawAmount={ this.state.withdrawAmount }
              />
          </Col>
          <Col span={ 8 }>
            { this.renderSettingCard() }
          </Col>
        </Row>
        <Row>
          <TransactionHistory
             transactionHistory={ this.props.transactionHistory }
             transactionHistoryLoadingStatus={ this.props.transactionHistoryLoadingStatus }
             transactionHistoryExport={ this.props.transactionHistoryExport }
             transactionHistoryExportLoadingStatus={ this.props.transactionHistoryExportLoadingStatus }
             exportButtonClicked={ this.state.exportButtonClicked }
             handleSearchClick={ this.searchTransactionHistory }
             handleExportClick={ this.exportTransactionHistory }
             resetTransactionHistoryExportLoadingStatus={ this.resetTransactionHistoryExportLoadingStatus }
             clearTransactionHistoryExport={ this.clearTransactionHistoryExport }
             periodChange={ this.periodChange } showDateFields={ this.state.showDateFields }
             onStartChange={ this.onStartChange } onEndChange={ this.onEndChange }
             disabledFromDate={ this.disabledFromDate } disabledToDate={ this.disabledToDate }
             fromDate={ this.state.fromDate } toDate={ this.state.toDate }
           />
        </Row>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const app = state.get('app');
  const account = state.get('account');
  const accountId = account.getIn(['account','id']);
  const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting']) ;

  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset '1.3.0' is not obtained for some reason
  */
  const balance = account.getIn(['availableBalancesByAssetId','1.3.0','balance']);
  const availableBalance = balance !== undefined ? balance : -1;

  //Transaction History table Data (dummy data binding)
  let transactionHistoryData = [];
  if(state.getIn(['account', 'getTransactionHistoryLoadingStatus']) === LoadingStatus.DONE)
  {
    transactionHistoryData = [];
    state.getIn(['account', 'transactionHistories']).forEach(row => {
      let rowObj = {
        key: row.get('id'),
        id: row.get('id'),
        time: moment(row.get('time')).format('DD/MM/YYYY HH:mm:ss'),
        'desc': row.get('description'),
        'status': <span
          className={ row.get('status') ==='Processing' ? 'processed'
            : (row.get('status') ==='Completed' ? 'completed' : '') }>{ row.get('status') }</span>,
        'amount': row.getIn(['op',1,'fee', 'amount']) + ' ' + (setting.currencyFormat!==undefined ? setting.currencyFormat : '')
      };
      transactionHistoryData.push(rowObj);
    });
  }

  //Transaction History table Data (to export to Excel file)
  let transactionHistoryExportData = [];
  if(state.getIn(['account', 'getTransactionHistoriesExportLoadingStatus']) === LoadingStatus.DONE)
  {
    transactionHistoryExportData = [];
    state.getIn(['account', 'transactionHistoriesExport']).forEach(row => {
      let rowObj = {
        Id: row.get('id'),
        Time: moment(row.get('time')).format('DD/MM/YYYY HH:mm:ss'),
        Description: row.get('description'),
        Status: row.get('status'),
        Amount: row.getIn(['op',1,'fee', 'amount']) + ' ' + (setting.currencyFormat!==undefined ? setting.currencyFormat : '')
      };
      transactionHistoryExportData.push(rowObj);
    });
  }

  return {
    dynGlobalObject: app.get('blockchainDynamicGlobalProperty'),
    globalObject: app.get('blockchainGlobalProperty'),
    account: account.get('account'),
    password: account.get('password'),
    lang: setting.get('lang'),
    timezone: setting.get('timezone'),
    notification: setting.get('notification'),
    currencyFormat: setting.get('currencyFormat'),
    precision: state.getIn(['asset', 'assetsById', '1.3.0']).get('precision'),
    transactionHistory: transactionHistoryData,
    transactionHistoryLoadingStatus: account.get('getTransactionHistoryLoadingStatus'),
    transactionHistoryExport: transactionHistoryExportData,
    transactionHistoryExportLoadingStatus: account.get('getTransactionHistoriesExportLoadingStatus'),
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    loadingStatus: account.get('getDepositAddressLoadingStatus'),
    depositAddress: account.get('depositAddress'),
    availableBalance: availableBalance,
    withdrawLoadingStatus: account.get('withdrawLoadingStatus')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSettingLang: SettingActions.updateSettingLang,
    updateSettingTimeZone: SettingActions.updateSettingTimeZone,
    updateSettingNotification: SettingActions.updateSettingNotification,
    updateCurrencyFormat: SettingActions.updateCurrencyFormat,
    getTransactionHistory: AccountActions.getTransactionHistory,
    getTransactionHistoryExport: AccountActions.getTransactionHistoriesExport,
    resetTransactionHistoryExportLoadingStatus: AccountActions.resetTransactionHistoryExportLoadingStatus,
    clearTransactionHistoryExport: AccountActions.clearTransactionHistoryExport,
    getDepositAddress: AccountActions.getDepositAddress,
    redirectToChangePwd: SettingActions.redirectToChangePwd,
    withdraw: AccountActions.withdraw
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
