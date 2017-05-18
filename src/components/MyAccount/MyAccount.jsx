import React, { PureComponent } from 'react';
import ReactDOM from "react-dom";
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
import { BlockchainUtils, FileSaverUtils } from '../../utility';
import { CommunicationService } from '../../services';
import Deposit from './Deposit';
//import Withdraw from './Withdraw';
import { MyAccountWithdraw } from '../Withdraw';
import moment from 'moment';
import { SettingActions, BalanceActions, NavigateActions, HistoryActions, MyAccountPageActions, AccountActions } from '../../actions';
import { LoadingStatus } from '../../constants';
import { BettingModuleUtils, CurrencyUtils } from '../../utility';
import { MyAccountPageSelector } from '../../selectors';


const Option = Select.Option;

class MyAccount extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      //Show/Hide date fields based on 'Period' selection
      withdrawAmount:'',
      exportButtonClicked: false
    }

    // this.fetchRecentTransactionHistory = this.fetchRecentTransactionHistory.bind(this);
    this.handleCurrFormatChange = this.handleCurrFormatChange.bind(this);
    this.handleNotificationChange = this.handleNotificationChange.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);

    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.resetTransactionHistoryExportLoadingStatus = this.resetTransactionHistoryExportLoadingStatus.bind(this);
    this.clearTransactionHistoryExport = this.clearTransactionHistoryExport.bind(this);
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);
    this.renderSettingCard = this.renderSettingCard.bind(this);
    this.handleDownloadPasswordFile = this.handleDownloadPasswordFile.bind(this);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);

  }

  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.sidebar));
    //Get the deposit address
    this.props.getDepositAddress();
  }

  componentDidUpdate(prevProps, prevState){
    Ps.update(ReactDOM.findDOMNode(this.refs.sidebar));
  }

  //Search transaction history with filters
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // Set time range
    this.props.setHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeStartDate);
    //Format from date and to date in the required format and pass
    // this.props.getTransactionHistory(startDate.format("YYYY-MM-DD HH:mm:ss"),
    //            endDate.format("YYYY-MM-DD HH:mm:ss"));
  }

  //Export transaction history
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    this.props.setExportHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    //To show export related status after the 'Export' button is clicked
    this.setState({ exportButtonClicked: true });
    // this.props.getTransactionHistory(startDate.format("YYYY-MM-DD HH:mm:ss"),
    //            endDate.format("YYYY-MM-DD HH:mm:ss"));
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


<<<<<<< e5e22eb80e32ff9891619cbee623bb457c615c09
          let last_irreversible_block_num = this.props.dynGlobalObject.get('last_irreversible_block_num');
          let status = 'completed';
          if (order.block_num > last_irreversible_block_num) {
            status = (order.block_num - last_irreversible_block_num) + 'imcomplete';
          }
          order.status = status;


          newTxList.push(order);
        });

        this.setState({txList: newTxList});

      });
  }
=======
>>>>>>> move transaction history startDate/ endDate to redux store and pull out time range picker from my account page

  handleNotificationChange(value) {
    const {updateSettingNotification} = this.props
    updateSettingNotification(value)
  }

  handleCurrFormatChange(value) {
    const {updateCurrencyFormat} = this.props
    updateCurrencyFormat(value)
  }


  handleRedirectToChangePwd(){
    this.props.navigateTo('/change-password');
  }

  handleWithdrawSubmit(values){
    //track the withdraw amount to display in success message after successful submit
    this.setState({ withdrawAmount:values.get('withdrawAmount') });
    this.props.withdraw(values.get('withdrawAmount'), values.get('walletAddr'));
  }

  //Download the password in a text file
  handleDownloadPasswordFile() {
    this.props.downloadPassword();
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome(){
    this.props.navigateTo('/exchange');
  }

  renderSettingCard() {
    return (
      <Card className='bookie-card settingComponent'
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
        <Row className='margin-tb-25'>
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
        <div className='card-footer'>
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
          <Breadcrumb.Item>
            <a onClick={ this.handleNavigateToHome }>  {I18n.t('myAccount.home')} </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{I18n.t('myAccount.my_account')}</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={ 20 }>
          <Col span={ 8 }>
            <Deposit cardClass='bookie-card depositCardComponent' depositAddress={ this.props.depositAddress }/>
          </Col>
          <Col span={ 8 }>
            <MyAccountWithdraw cardClass='bookie-card withdrawComponent'
              currencyFormat={ this.props.currencyFormat }
              precision={ this.props.precision }
              availableBalance={ this.props.availableBalance }
              onSubmit={ this.handleWithdrawSubmit }
              withdrawLoadingStatus={ this.props.withdrawLoadingStatus }
              withdrawAmount={ this.state.withdrawAmount }
              convertedAvailableBalance={ this.props.convertedAvailableBalance }
              resetWithdrawLoadingStatus={ this.props.resetWithdrawLoadingStatus }
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
             handleSearchClick={ this.handleSearchClick }
             handleExportClick={ this.handleExportClick }
             resetTransactionHistoryExportLoadingStatus={ this.resetTransactionHistoryExportLoadingStatus }
             clearTransactionHistoryExport={ this.clearTransactionHistoryExport }
             currencyFormat={ this.props.currencyFormat }
             lastIrreversibleBlockNum={ this.props.lastIrreversibleBlockNum }
           />
        </Row>
      </div>
    )
  }
}


const mapStateToProps = (state) => {

  const precision = state.getIn(['asset', 'assetsById', '1.3.0']).get('precision');
  const currencyFormat = MyAccountPageSelector.currencyFormatSelector(state);

  //Transaction History table Data (to export to Excel file)
  let transactionHistoryExportData = [];
  if(state.getIn(['history', 'getTransactionHistoryExportLoadingStatus']) === LoadingStatus.DONE)
  {
    transactionHistoryExportData = [];
    state.getIn(['history', 'transactionHistoryExport']).forEach(row => {
      let rowObj = {
        Id: row.get('id'),
        Time: moment(row.get('time')).format('DD/MM/YYYY HH:mm:ss'),
        Description: row.get('description'),
        Status: row.get('status'),
        Amount: CurrencyUtils.getFormattedCurrency(row.getIn(['op',1,'fee', 'amount'])/ Math.pow(10, precision), currencyFormat, BettingModuleUtils.stakePlaces)
      };
      transactionHistoryExportData.push(rowObj);
    });
  }

  return {
    lastIrreversibleBlockNum: MyAccountPageSelector.lastIrreversibleBlockNumSelector(state),
    notification: MyAccountPageSelector.notificationSelector(state),
    currencyFormat: MyAccountPageSelector.currencyFormatSelector(state),
    precision: MyAccountPageSelector.coreAssetPrecisionSelector(state),
    transactionHistory: MyAccountPageSelector.filteredTransactionHistorySelector(state),
    transactionHistoryLoadingStatus: MyAccountPageSelector.initTransactionHistoryLoadingStatusSelector(state),
    transactionHistoryExport: transactionHistoryExportData,
    transactionHistoryExportLoadingStatus: state.getIn(['history', 'getTransactionHistoryExportLoadingStatus']),
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    loadingStatus: MyAccountPageSelector.getDepositAddressLoadingStatusSelector(state),
    depositAddress: MyAccountPageSelector.depositAddressSelector(state),
    availableBalance: MyAccountPageSelector.availableBalanceSelector(state),
    withdrawLoadingStatus: MyAccountPageSelector.withdrawLoadingStatusSelector(state),
    convertedAvailableBalance : MyAccountPageSelector.formattedAvailableBalanceSelector(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSettingLang: SettingActions.updateSettingLang,
    updateSettingTimeZone: SettingActions.updateSettingTimeZone,
    updateSettingNotification: SettingActions.updateSettingNotification,
    updateCurrencyFormat: SettingActions.updateCurrencyFormat,
    getTransactionHistory: HistoryActions.getTransactionHistoryGivenTimeRange,
    getTransactionHistoryExport: HistoryActions.getTransactionHistoryExport,
    resetTransactionHistoryExportLoadingStatus: HistoryActions.resetTransactionHistoryExportLoadingStatus,
    clearTransactionHistoryExport: HistoryActions.clearTransactionHistoryExport,
    getDepositAddress: BalanceActions.getDepositAddress,
    withdraw: BalanceActions.withdraw,
    resetWithdrawLoadingStatus: BalanceActions.resetWithdrawLoadingStatus,
    navigateTo: NavigateActions.navigateTo,
    setHistoryTimeRange: MyAccountPageActions.setHistoryTimeRange,
    setExportHistoryTimeRange: MyAccountPageActions.setExportHistoryTimeRange,
    resetTimeRange: MyAccountPageActions.resetTimeRange,
    downloadPassword: AccountActions.downloadPassword,
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
