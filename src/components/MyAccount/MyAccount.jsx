/**
 * This component is used on the My Account screen.
 * It's sub-components include:
 *   {@link Deposit}            : Allow user to use deposit address to make deposit
 *   {@link MyAccountWithdraw}  : Allow user to withdraw amount from his wallet
 *   Settings                   : Allow user to change the following settings:
 *                                  - Enable/Disable notifications
 *                                  - Change currency format (BTC or mBTC) :
 *                                    change will be reflected throughout the application
 *                                  - Change password of the user
 *                                  - Save and download the user's password in a text file
 *   {@link TransactionHistory} : Allow user to view his transaction history data
 *                                along with data filtering and export to excel
 *
 * The states of this component are maintained in a number of Redux stores
 * which are encapsulated in the 'MyAccountPageSelector'
 *
 * Following are the actions dispatched for various purposes in this component:
 *    {@link SettingActions#updateSettingNotification}
 *    {@link SettingActions#updateCurrencyFormat}
 *    {@link SettingActions#updateOddsFormat}
 *    {@link BalanceActions#getDepositAddress}
 *    {@link BalanceActions#withdraw}
 *    {@link BalanceActions#resetWithdrawLoadingStatus}
 *    {@link NavigateActions#navigateTo} : navigates to specified location
 *    {@link MyAccountPageActions#setHistoryTimeRange}
 *    {@link MyAccountPageActions#generateTransactionHistoryExportData}
 *    {@link MyAccountPageActions#resetTransactionHistoryExportDataAction}
 *    {@link MyAccountPageActions#resetTimeRange}
 *    {@link AccountActions#downloadPassword}
 * Effects of the above actions on the Redux stores are explained furthur
 *
 */
import React, {PureComponent} from 'react';
import {I18n} from 'react-redux-i18n';
import TransactionHistory from './TransactionHistory';
import {Row, Col, Card, Switch, Select, Breadcrumb} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './MyAccount.less';
import Deposit from './Deposit';
import {MyAccountWithdraw} from '../Withdraw';
import {
  SettingActions,
  BalanceActions,
  NavigateActions,
  MyAccountPageActions,
  AccountActions
} from '../../actions';
import {MyAccountPageSelector} from '../../selectors';
import PeerPlaysLogo from '../PeerPlaysLogo';
import {Config} from '../../constants';
import {AppUtils} from '../../utility';


const Option = Select.Option;

class MyAccount extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      withdrawAmount: ''
    };

    this.handleCurrFormatChange = this.handleCurrFormatChange.bind(this);
    this.handleOddsFormatChange = this.handleOddsFormatChange.bind(this);
    this.handleNotificationChange = this.handleNotificationChange.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);

    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleResetExport = this.handleResetExport.bind(this);

    this.renderSettingCard = this.renderSettingCard.bind(this);
    this.handleDownloadPasswordFile = this.handleDownloadPasswordFile.bind(this);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.handleRedirectToChangePwd = this.handleRedirectToChangePwd.bind(this);
  }

  /**
   * Deposit component: {@link Deposit}
   * Fetches the deposit address of the user when the component mounts
   *
   * Dispatched action: {@link BalanceActions#getDepositAddress}
   *   the state 'depositAddress',
   *   'getDepositAddressLoadingStatus' is updated under the 'balance' store
   */
  componentDidMount() {
    this.props.getDepositAddress();
  }

  /**
   * Filter component: {@link TimeRangePicker}
   * Resets the search filter data to it's initial values when the component unmounts
   *
   * Dispatched action: {@link MyAccountPageActions#resetTimeRange}
   *   the states 'periodType','customTimeRangeStartDate','customTimeRangeEndDate'
   *   is reset to it's initial values under the 'myAccountPage' store
   */
  componentWillUnmount() {
    this.props.resetTimeRange();
  }

  /**
   * Called when the 'Search' button is clicked - {@link TimeRangePicker}
   * @param {string} periodType - the selected period from the dropdown
   * @param {string} customTimeRangeStartDate - the start date selected (if custom date selected)
   * @param {string} customTimeRangeEndDate - the end date selected (if custom date selected)
   *
   * Dispatched action: {@link MyAccountPageActions#setHistoryTimeRange}
   *    the states 'periodType','customTimeRangeStartDate','customTimeRangeEndDate'
   *    is updated under the 'myAccountPage' store
   */
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    this.props.setHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
  }

  /**
   * Called when the 'Export' button is clicked- {@link TimeRangePicker}
   * @param {string} periodType - the selected period from the dropdown
   * @param {string} customTimeRangeStartDate - the start date selected (if custom date selected)
   * @param {string} customTimeRangeEndDate - the end date selected (if custom date selected)
   *
   * Dispatched actions:
   *   {@link MyAccountPageActions#setHistoryTimeRange} :
   *      the states 'periodType','customTimeRangeStartDate','customTimeRangeEndDate'
   *      is updated under the 'myAccountPage' store
   *   {@link MyAccountPageActions#generateTransactionHistoryExportData} :
   *      the states 'transactionHistoryExportData',
   *      'generateTransactionHistoryExportDataLoadingStatus'
   *      is updated under the 'myAccountPage' store
   *
   */
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    // First set the history time range, so the search result is re-filtered
    this.props.setHistoryTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    // Then generate export data
    this.props.generateTransactionHistoryExportData();
  }

  /**
   * Resets the transaction history export data to it's initial value - {@link Export}
   *
   * Dispatched action: {@link MyAccountPageActions#resetTransactionHistoryExportData}
   *   the state 'transactionHistoryExportData' is reset to it's initial state
   *   under the 'myAccountPage' store
   */
  handleResetExport() {
    this.props.resetTransactionHistoryExportData();
  }

  /**
   * Called when the user's notification setting is changed
   *
   * Dispatched action: {@link SettingActions#updateSettingNotification}
   *   the state 'notification' is updated under the 'setting' store
   */
  handleNotificationChange(value) {
    const {updateSettingNotification} = this.props;
    updateSettingNotification(value);
  }

  /**
   * Called when the user's currency setting is changed
   *
   * Dispatched action: {@link SettingActions#updateCurrencyFormat}
   *   the state 'currencyFormat' is updated under the 'setting' store
   */
  handleCurrFormatChange(value) {
    const {updateCurrencyFormat} = this.props;
    updateCurrencyFormat(value);
  }

  /**
   * Called when the user's odds format setting is changed
   *
   * Dispatched action: {@link SettingActions#updateOddsFormat}
   *   the state 'oddsFormat' is updated under the 'setting' store
   */
  handleOddsFormatChange(value) {
    const {updateOddsFormat} = this.props;
    updateOddsFormat(value);
  }

  /**
   * Navigate to the 'Change Password' screen - - {@link ChangePassword}
   */
  handleRedirectToChangePwd() {
    this.props.navigateTo('/change-password');
  }

  /**
   * Called when the 'Send' button is clicked on the withdraw component
   * @param {object} values - data obtained from the {@link MyAccountWithdraw}
   *
   * Dispatched action: {@link BalanceActions#withdraw}
   *   the state 'withdrawLoadingStatus' is updated under the 'balance' store after withdraw process
   */
  handleWithdrawSubmit(values) {
    //track the withdraw amount to display in success message after successful submit
    this.setState({withdrawAmount: values.get('withdrawAmount')});
    this.props.withdraw(values.get('withdrawAmount'), values.get('walletAddr'));
  }

  /**
   * Called when the 'Download Password' button is clicked on the settings section
   *
   * Dispatched action: {@link AccountActions#downloadPassword}
   *   state data 'password' is fetched from 'account' store to download in file
   */
  handleDownloadPasswordFile() {
    this.props.downloadPassword();
  }

  /**
   * Navigate to the 'Home' screen when clicked on 'Home'
   * link on the Breadcrumb - {@link Exchange}
   */
  handleNavigateToHome() {
    this.props.navigateTo(AppUtils.getHomePath(this.props.bookMode));
  }

  /**
   * This method generates 'antd' card to create the markup for 'Settings' section
   * on the My Account screen
   */
  renderSettingCard() {
    return (
      <Card
        className='bookie-card settingComponent'
        title={ I18n.t('myAccount.settings') }
        bordered={ false }
        style={ {width: '100%'} }
        id='setting_card_1'
      >
        <Row>
          <Col span={ 18 }>
            <p> {I18n.t('myAccount.notifications')}</p>
          </Col>
          <Col span={ 6 }>
            <Switch
              className='bookie-switch'
              defaultChecked={ this.props.notification }
              onChange={ this.handleNotificationChange }
            />
          </Col>
        </Row>

        <Row className='margin-tb-15'>
          <Col span={ 18 }>
            <p className='padding-tb-5'>{I18n.t('myAccount.format')}</p>
          </Col>
          <Col span={ 6 }>
            <div ref='global_object'>
              <Select
                className='bookie-select'
                defaultValue={ this.props.currencyFormat }
                onChange={ this.handleCurrFormatChange }
                getPopupContainer={ () => document.getElementById('setting_card_1') }
              >
                <Option value={ this.props.currencySymbol }> {this.props.currencySymbol}</Option>
                <Option value={ 'm' + this.props.currencySymbol }>
                  {'m' + this.props.currencySymbol}
                </Option>
              </Select>
            </div>
          </Col>
        </Row>

        {// @ FEATURE_FLAG
          this.props.americanOddsEnabled ? (
            <Row className='margin-tb-15'>
              <Col span={ 18 }>
                <p className='padding-tb-5'>{I18n.t('myAccount.oddsFormat')}</p>
              </Col>
              <Col span={ 6 }>
                <div ref='global_object'>
                  <Select
                    className='bookie-select'
                    defaultValue={ this.props.oddsFormat }
                    onChange={ this.handleOddsFormatChange }
                  >
                    <Option value='decimal'>Decimal</Option>
                    <Option value='american'>American</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          ) : (
            ''
          )}

        <div className='card-footer'>
          <Row className='registerComponent'>
            <button
              onClick={ this.handleRedirectToChangePwd }
              className='btn btn-primary margin-tb-15'
            >
              {I18n.t('myAccount.change_password')}
            </button>
            <button className='btn btn-cancel' onClick={ this.handleDownloadPasswordFile }>
              {I18n.t('myAccount.create_recovery_file')}
            </button>
          </Row>
        </div>
      </Card>
    );
  }

  render() {
    return (
      <div className='my-account section-padding'>
        <Row>
          <Col span={ 16 }>
            <Breadcrumb className='bookie-breadcrumb'>
              <Breadcrumb.Item>
                <a onClick={ this.handleNavigateToHome }> {I18n.t('myAccount.home')} </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{I18n.t('myAccount.my_account')}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={ 8 }>
            <div className='welcome'>
              {I18n.t('myAccount.welcome_back')},{' '}
              <span className='account-name'>{this.props.accountName}</span>
            </div>
          </Col>
        </Row>
        <Row gutter={ 20 }>
          {this.props.depositsEnabled ? ( // @ FEATURE_FLAG
            <Col span={ 8 }>
              <Deposit
                cardClass='bookie-card depositCardComponent'
                depositAddress={ this.props.depositAddress }
                currency={ this.props.currencyFormat }
              />
            </Col>
          ) : null}
          {this.props.withdrawalsEnabled ? (
            <Col span={ 8 }>
              <MyAccountWithdraw
                cardClass='bookie-card withdrawComponent'
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
          ) : null}
          <Col span={ 10 }>{this.renderSettingCard()}</Col>
        </Row>
        <Row>
          <TransactionHistory
            currencyFormat={ this.props.currencyFormat }
            lastIrreversibleBlockNum={ this.props.lastIrreversibleBlockNum }
            transactionHistory={ this.props.transactionHistory }
            transactionHistoryLoadingStatus={ this.props.transactionHistoryLoadingStatus }
            handleSearchClick={ this.handleSearchClick }
            handleExportClick={ this.handleExportClick }
            exportData={ this.props.transactionHistoryExportData }
            exportLoadingStatus={ this.props.generateTransactionHistoryExportDataLoadingStatus }
            handleResetExport={ this.handleResetExport }
          />
        </Row>
        <Row>
          <PeerPlaysLogo />
        </Row>
      </div>
    );
  }
}

MyAccount.defaultProps = {
  depositsEnabled: Config.features.deposits,
  withdrawalsEnabled: Config.features.withdrawels,
  currencySymbol: Config.features.currency,
  americanOddsEnabled: Config.features.americanOdds
};

const mapStateToProps = (state) => ({
  lastIrreversibleBlockNum: MyAccountPageSelector.lastIrreversibleBlockNumSelector(state),
  notification: MyAccountPageSelector.notificationSelector(state),
  currencyFormat: MyAccountPageSelector.currencyFormatSelector(state),
  oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
  precision: MyAccountPageSelector.coreAssetPrecisionSelector(state),
  transactionHistory: MyAccountPageSelector.filteredTransactionHistorySelector(state),
  transactionHistoryLoadingStatus: MyAccountPageSelector.initRawHistoryLoadingStatusSelector(
    state
  ),
  transactionHistoryExportData: MyAccountPageSelector.transactionHistoryExportDataSelector(state),
  generateTransactionHistoryExportDataLoadingStatus: MyAccountPageSelector.generateTransactionHistoryExportDataLoadingStatusSelector( // eslint-disable-line
    state
  ),
  //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
  loadingStatus: MyAccountPageSelector.getDepositAddressLoadingStatusSelector(state),
  depositAddress: MyAccountPageSelector.depositAddressSelector(state),
  availableBalance: MyAccountPageSelector.availableBalanceSelector(state),
  withdrawLoadingStatus: MyAccountPageSelector.withdrawLoadingStatusSelector(state),
  convertedAvailableBalance: MyAccountPageSelector.formattedAvailableBalanceSelector(state),
  accountName: MyAccountPageSelector.accountNameSelector(state),
  bookMode: state.getIn(['app', 'bookMode'])
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateSettingLang: SettingActions.updateSettingLang,
      updateSettingTimeZone: SettingActions.updateSettingTimeZone,
      updateSettingNotification: SettingActions.updateSettingNotification,
      updateCurrencyFormat: SettingActions.updateCurrencyFormat,
      updateOddsFormat: SettingActions.updateOddsFormat,
      getDepositAddress: BalanceActions.getDepositAddress,
      withdraw: BalanceActions.withdraw,
      resetWithdrawLoadingStatus: BalanceActions.resetWithdrawLoadingStatus,
      navigateTo: NavigateActions.navigateTo,
      setHistoryTimeRange: MyAccountPageActions.setHistoryTimeRange,
      generateTransactionHistoryExportData:
        MyAccountPageActions.generateTransactionHistoryExportData,
      resetTransactionHistoryExportData:
        MyAccountPageActions.resetTransactionHistoryExportDataAction,
      resetTimeRange: MyAccountPageActions.resetTimeRange,
      downloadPassword: AccountActions.downloadPassword
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccount);
