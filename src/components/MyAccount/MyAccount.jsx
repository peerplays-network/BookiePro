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
import Deposit from './Deposit';
import { MyAccountWithdraw } from '../Withdraw';
import { SettingActions, BalanceActions, NavigateActions, MyAccountPageActions, AccountActions } from '../../actions';
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
    this.handleExportFinishDownload = this.handleExportFinishDownload.bind(this);
    this.handleExportCancel = this.handleExportCancel.bind(this);

    this.renderSettingCard = this.renderSettingCard.bind(this);
    this.handleDownloadPasswordFile = this.handleDownloadPasswordFile.bind(this);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);
  }

  componentDidMount() {
    //Get the deposit address
    this.props.getDepositAddress();
  }

  //Search transaction history with filters
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // Set time range.
    this.props.setHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
  }

  //Export transaction history
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    this.props.generateTransactionHistoryExportData(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    //To show export related status after the 'Export' button is clicked
    this.setState({ exportButtonClicked: true });
  }

  handleExportFinishDownload() {
    // Reset
    this.props.resetTransactionHistoryExportData();
  }

  //Cancel transaction history export - Resetting it's loading status to 'default'
  handleExportCancel(){
    this.props.resetTransactionHistoryExportData();
    this.setState({ exportButtonClicked: false });
  }

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
             transactionHistoryExportData={ this.props.transactionHistoryExportData }
             generateTransactionHistoryExportDataLoadingStatus={ this.props.generateTransactionHistoryExportDataLoadingStatus }
             exportButtonClicked={ this.state.exportButtonClicked }
             handleExportFinishDownload={ this.handleExportFinishDownload }
             handleSearchClick={ this.handleSearchClick }
             handleExportClick={ this.handleExportClick }
             currencyFormat={ this.props.currencyFormat }
             lastIrreversibleBlockNum={ this.props.lastIrreversibleBlockNum }
             resetExport={ this.handleExportCancel }
           />
        </Row>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    lastIrreversibleBlockNum: MyAccountPageSelector.lastIrreversibleBlockNumSelector(state),
    notification: MyAccountPageSelector.notificationSelector(state),
    currencyFormat: MyAccountPageSelector.currencyFormatSelector(state),
    precision: MyAccountPageSelector.coreAssetPrecisionSelector(state),
    transactionHistory: MyAccountPageSelector.filteredTransactionHistorySelector(state),
    transactionHistoryLoadingStatus: MyAccountPageSelector.initRawHistoryLoadingStatusSelector(state),
    transactionHistoryExportData: MyAccountPageSelector.transactionHistoryExportDataSelector(state),
    generateTransactionHistoryExportDataLoadingStatus: MyAccountPageSelector.generateTransactionHistoryExportDataLoadingStatusSelector(state),
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
    getDepositAddress: BalanceActions.getDepositAddress,
    withdraw: BalanceActions.withdraw,
    resetWithdrawLoadingStatus: BalanceActions.resetWithdrawLoadingStatus,
    navigateTo: NavigateActions.navigateTo,
    setHistoryTimeRange: MyAccountPageActions.setHistoryTimeRange,
    generateTransactionHistoryExportData: MyAccountPageActions.generateTransactionHistoryExportData,
    resetTransactionHistoryExportData: MyAccountPageActions.resetTransactionHistoryExportDataAction,
    resetTimeRange: MyAccountPageActions.resetTimeRange,
    downloadPassword: AccountActions.downloadPassword,
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
