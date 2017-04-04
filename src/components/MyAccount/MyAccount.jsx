import React, {Component} from 'react';
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
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import dateFormat from 'dateformat';
import { SettingActions, AccountActions } from '../../actions';

const Option = Select.Option;

let isMounted = false;

class MyAccount extends Component {

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
      endDate:dateFormat(endDate, "yyyy-mm-dd h:MM:ss"),
      withdrawAmount:''
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
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);

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
    isMounted = true;
    this.searchTransactionHistory();
    // this.fetchRecentTransactionHistory();
    //ps.initialize(this.refs.global);
    //ps.update(this.refs.global);

    //Get the deposit address
    this.props.getDepositAddress();
  }

  componentWillUnmount(){
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
                defaultValue='BTC'
                onChange={ this.handleTimeZoneChange }>
                <Option value='UTC-12:00'> BTC</Option>
                <Option value='UTC-11:00'>mBTC</Option>
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
            <button className='btn btn-primary'>
              { I18n.t('myAccount.create_recovery_file') }
            </button>
          </Row>
        </div>

      </Card>
    );
  }

  render() {
    const {showDateFields} = this.state;
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


const mapStateToProps = (state) => {
  const app = state.get('app');
  const account = state.get('account');
  const setting = state.get('setting');
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset '1.3.0' is not obtained for some reason
  */
  const balance = account.getIn(['availableBalancesByAssetId','1.3.0','balance']);
  const availableBalance = balance !== undefined ? balance : -1;
  return {
    dynGlobalObject: app.get('blockchainDynamicGlobalProperty'),
    globalObject: app.get('blockchainGlobalProperty'),
    account: account.get('account'),
    lang: setting.get('lang'),
    timezone: setting.get('timezone'),
    notification: setting.get('notification'),
    currencyFormat: setting.get('currencyFormat'),
    transactionHistory: state.getIn(['account', 'transactionHistories']),
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
    getTransactionHistory: AccountActions.getTransactionHistories,
    getDepositAddress: AccountActions.getDepositAddress,
    redirectToChangePwd: SettingActions.redirectToChangePwd,
    //TODO: Wallet Address verification and error response pending.
    withdraw: AccountActions.withdraw
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
