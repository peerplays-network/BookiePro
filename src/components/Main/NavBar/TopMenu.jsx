import React, {PureComponent} from 'react';
import {Badge, Menu, Dropdown, Tooltip} from 'antd';
import Deposit from '../../MyAccount/Deposit';
import {TopMenuWithdraw} from '../../Withdraw';
import Amount from './AmountDropDown';
import Notification from './Notification';
import DropdownMenu from './DropdownMenu';
import {
  AuthActions,
  BalanceActions,
  NotificationActions,
  NavigateActions,
  AppActions
} from '../../../actions';
import {NotificationTypes, Config} from '../../../constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {CurrencyUtils, BettingModuleUtils, ObjectUtils} from '../../../utility';
import {createSelector} from 'reselect';
import {initialize} from 'redux-form';
const {getStakeFromBetObject, getProfitLiabilityFromBetObject} = ObjectUtils;
import {I18n} from 'react-redux-i18n';

import {AppUtils} from '../../../utility';

const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

let electron;

if (isRunningInsideElectron) {
  electron = window.require('electron');
}

class TopMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 'smile',
      isAmountComponentVisible: false,
      isDepositComponentVisible: false,
      isTopMenuWithdrawComponentVisible: false,
      isNotificationComponentVisible: false,
      withdrawAmount: '',
      isSubMenuVisible: false,
      isNotificationCardVisible: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
    this.handleNotificationCardItemClick = this.handleNotificationCardItemClick.bind(this);
    this.handleNotificationCardItemClickClose = this.handleNotificationCardItemClickClose.bind(
      this
    );
    this.handleNotificationCardVisibleChange = this.handleNotificationCardVisibleChange.bind(this);
    this.handleAmountComponentVisibleChange = this.handleAmountComponentVisibleChange.bind(this);
    this.handleDepositComponentVisibleChange = this.handleDepositComponentVisibleChange.bind(this);
    this.handleTopMenuWithdrawComponentVisibleChange = this.handleTopMenuWithdrawComponentVisibleChange.bind(this); // eslint-disable-line
    this.gotoMyAccount = this.gotoMyAccount.bind(this);
    this.handleSubMenuVisibleChange = this.handleSubMenuVisibleChange.bind(this);
  }

  gotoMyAccount() {
    this.props.navigateTo('/my-account');
    this.setState({isSubMenuVisible: false});
  }

  handleWithdrawSubmit(values) {
    //track the withdraw amount to display in success message after successfull submit
    this.setState({withdrawAmount: values.get('topMenuWithdrawAmount')});
    this.props.withdraw(values.get('topMenuWithdrawAmount'), values.get('topMenuWalletAddr'));
  }

  handleNotificationCardVisibleChange(visible) {
    this.setState({isNotificationComponentVisible: visible});
    this.props.showNotificationCard(visible);
  }

  handleNotificationCardItemClickClose(notification) {
    const notificationId = notification && notification.get('id');
    this.props.removeNotifications([notificationId]);
  }

  handleNotificationCardItemClick(notification) {
    const notificationType = notification && notification.get('type');

    switch (notificationType) {
      case NotificationTypes.DEPOSIT: {
        this.props.navigateTo('/my-account');
        break;
      }

      case NotificationTypes.BET_RESOLVED: {
        this.props.navigateTo('/my-wager');
        break;
      }

      case NotificationTypes.EVENT_CANCELLED: {
        this.props.navigateTo('/my-account');
        break;
      }

      case NotificationTypes.SOFTWARE_UPDATE_AVAILABLE: {
        if (electron) {
          // Case of electron
          electron.shell.openExternal(notification.get('link'));
        }

        break;
      }

      case NotificationTypes.TRANSACTION_HISTORY_DATA_EXPORTED: {
        break;
      }

      default: {
        break;
      }
    }

    // Hide notification dropdown
    this.setState(() => ({isNotificationCardVisible: false}));
  }

  componentDidMount() {
    //Get the deposit address
    this.props.getDepositAddress();
  }

  handleClick(e) {
    //TODO:handle selected menu
    event.preventDefault();

    this.setState({
      current: e.key
    });

    switch (e.key) {
      case 'mywager':
        this.props.navigateTo('/my-wager');
        break;
      case 'myaccount':
        this.props.navigateTo('/my-account');
        this.setState({isSubMenuVisible: false});
        break;
      case 'help':
        this.props.navigateTo('/help-and-support');
        this.setState({isSubMenuVisible: false});
        break;
      case 'logout':
        this.props.logout();
        this.setState({isSubMenuVisible: false});
        break;
      case 'notifications':
        this.props.markNotificationsAsRead();
        break;
      default:
    }

    this.props.resetWithdrawLoadingStatus();
    this.props.initialize('topMenuWithdrawForm', {});
  }

  //Set sub menu visibility
  handleSubMenuVisibleChange (flag) {
    this.setState({isSubMenuVisible: flag});
  };

  //Set Amount component visibility
  handleAmountComponentVisibleChange() {
    // Fogbugz-716: Disable the account balance button text color change
    this.setState({isAmountComponentVisible: false});
  };

  //Set Deposit component visibility
  handleDepositComponentVisibleChange(isVisible) {
    this.setState({isDepositComponentVisible: isVisible});
  };

  //Set TopMenuWithdraw component visibility
  handleTopMenuWithdrawComponentVisibleChange(isVisible) {
    this.setState({isTopMenuWithdrawComponentVisible: isVisible});
  };

  render() {
    const amountCard = (
      <Amount
        cardClass='bookie-card bookie-amount-card'
        currencyFormat={ CurrencyUtils.getCurrencySymbol(this.props.currencyFormat) }
        availableBalance={ this.props.availableBalance }
        inGameAmount={ this.props.inGameAmount }
      />
    );
    const depositCard = (depositAddress) => (
      <Deposit
        cardClass='bookie-card deposit-card depositCardComponent'
        depositAddress={ depositAddress }
      />
    );
    const withdrawCard = (
      <TopMenuWithdraw
        cardClass='bookie-card withdraw-card withdrawComponent'
        currencyFormat={ this.props.currencyFormat }
        precision={ this.props.precision }
        availableBalance={ this.props.availableBalance }
        onSubmit={ this.handleWithdrawSubmit }
        withdrawLoadingStatus={ this.props.withdrawLoadingStatus }
        withdrawAmount={ this.state.withdrawAmount }
        convertedAvailableBalance={ this.props.convertedAvailableBalance }
        resetWithdrawLoadingStatus={ this.props.resetWithdrawLoadingStatus }
      />
    );
    const dropdownMenuCard = (
      <DropdownMenu
        cardClass='menu-card'
        onSubmenuClick={ this.handleClick }
        currentKey={ this.state.current }
      />
    );
    const notificationCard = (
      <Notification
        notifications={ this.props.notifications }
        onClickItem={ this.handleNotificationCardItemClick }
        onClickCloseItem={ this.handleNotificationCardItemClickClose }
      />
    );

    const iconCurrencyClass = (isAmountComponentVisible, currencyFormat) => {
      let configCurrency = Config.features.currency;
      let isMili = CurrencyUtils.getCurrencyType(currencyFormat) === 'mCoin';

      if (currencyFormat !== configCurrency) {

        if (isMili) {
          currencyFormat = 'm' + configCurrency;
        } else {
          currencyFormat = configCurrency;
        }
      }

      switch (currencyFormat) {
        case 'BTC':
          return isAmountComponentVisible ? 'bitcoin-icon-selected' : 'bitcoin-icon';
        case 'mBTC':
          return isAmountComponentVisible ? 'mbitcoin-icon-selected' : 'mbitcoin-icon';
        case 'BTF':
          return isAmountComponentVisible ? 'bitfun-icon-selected' : 'bitfun-icon';
        case 'mBTF':
          return isAmountComponentVisible ? 'mbitfun-icon-selected' : 'mbitfun-icon';
        default:
          break;
      }
    };

    const parentIconCurrencyClass = () => {
      let configCurr = Config.features.currency;

      if (configCurr === 'BTC') {
        return 'icon-main bitcoin-icon-main';
      } else if (configCurr === 'BTF') {
        return 'icon-main bitfun-icon-main';
      }
    };

    return (
      <Menu
        className='top-menu'
        theme='dark'
        onClick={ this.handleClick }
        selectedKeys={ [this.state.current] }
        mode='horizontal'
      >
        <Menu.Item key='balance' className='amount'>
          {
            // Fogbugz-716: Disable the account balance panel by setting visible={ false }
          }
          <div className='account-balance-item'>
            <Tooltip
              overlayClassName='bookie-tooltip'
              placement='bottom'
              title={ I18n.t('topbar_tooltip.account_name') }
            >
              <a className='account-name' key='myaccount' onClick={ this.gotoMyAccount }>
                {this.props.accountName
                  ? this.props.accountName.length < 15
                    ? this.props.accountName
                    : this.props.accountName.substring(0, 15).concat('...')
                  : ''}
              </a>
            </Tooltip>
            <Dropdown
              trigger={ ['click'] }
              overlay={ amountCard }
              placement='bottomRight'
              onVisibleChange={ this.handleAmountComponentVisibleChange }
              visible={ false }
            >
              <Tooltip
                overlayClassName='bookie-tooltip bookie-tooltip-amount'
                placement='bottom'
                title={ I18n.t('topbar_tooltip.account_balance') }
              >
                <div className={ parentIconCurrencyClass() }>
                  <a
                    className={
                      this.state.isAmountComponentVisible
                        ? 'ant-dropdown-link-clicked '
                        : 'ant-dropdown-link'
                    }
                    href='#'
                  >
                    <div>
                      <i
                        className={ iconCurrencyClass(
                          this.state.isAmountComponentVisible,
                          this.props.currencyFormat
                        ) }
                      />
                      {this.props.availableBalance}
                    </div>
                  </a>
                </div>
              </Tooltip>
            </Dropdown>
          </div>
        </Menu.Item>
        <Menu.Item key='mywager'>
          <Tooltip
            overlayClassName='bookie-tooltip'
            placement='bottom'
            title={ I18n.t('topbar_tooltip.my_bets') }
          >
            <div className='icon-main mywager-icon-main'>
              <i
                className={
                  this.props.routePath === '/my-wager' ? 'mywager-icon-selected' : 'mywager-icon'
                }
              />
            </div>
          </Tooltip>
        </Menu.Item>
        {this.props.depositsEnabled ? (
          <Menu.Item key='deposit'>
            <Dropdown
              trigger={ ['click'] }
              overlay={ depositCard(this.props.depositAddress) }
              placement='bottomRight'
              onVisibleChange={ this.handleDepositComponentVisibleChange }
            >
              <Tooltip
                overlayClassName='bookie-tooltip'
                placement='bottom'
                title={ I18n.t('topbar_tooltip.deposit') }
              >
                <div className='icon-main deposit-icon-main'>
                  <a className='ant-dropdown-link' href='#'>
                    <i
                      className={
                        this.state.isDepositComponentVisible
                          ? 'deposit-icon-selected'
                          : 'deposit-icon'
                      }
                    />
                  </a>
                </div>
              </Tooltip>
            </Dropdown>
          </Menu.Item>
        ) : null}
        {this.props.withdrawalsEnabled ? (
          <Menu.Item key='withdraw'>
            <Dropdown
              trigger={ ['click'] }
              overlay={ withdrawCard }
              placement='bottomRight'
              onVisibleChange={ this.handleTopMenuWithdrawComponentVisibleChange }
            >
              <Tooltip
                overlayClassName='bookie-tooltip'
                placement='bottom'
                title={ I18n.t('topbar_tooltip.withdrawal') }
              >
                <div className='icon-main withdraw-icon-main'>
                  <a className='ant-dropdown-link'>
                    <i
                      className={
                        this.state.isTopMenuWithdrawComponentVisible
                          ? 'withdraw-icon-selected'
                          : 'withdraw-icon'
                      }
                    />
                  </a>
                </div>
              </Tooltip>
            </Dropdown>
          </Menu.Item>
        ) : null}

        <Menu.Item key='notifications' className='notification'>
          <Dropdown
            trigger={ ['click'] }
            overlay={ notificationCard }
            placement='bottomRight'
            visible={ this.props.isShowNotificationCard }
            onVisibleChange={ this.handleNotificationCardVisibleChange }
          >
            <Tooltip
              overlayClassName='bookie-tooltip'
              placement='bottom'
              title={ I18n.t('topbar_tooltip.notification') }
            >
              <div className='icon-main notification-icon-main'>
                <a className='ant-dropdown-link' href='#'>
                  <Badge count={ this.props.unreadNotificationNumber }>
                    <i
                      className={
                        this.state.isNotificationComponentVisible
                          ? 'notification-icon selected'
                          : 'notification-icon'
                      }
                    >
                      <span className='count-number'>{this.props.unreadNotificationNumber}</span>
                    </i>
                  </Badge>
                </a>
              </div>
            </Tooltip>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='drop-down'>
          <Dropdown
            key='drop-down-item'
            trigger={ ['click'] }
            overlay={ dropdownMenuCard }
            placement='bottomRight'
            onVisibleChange={ this.handleSubMenuVisibleChange }
            visible={ this.state.isSubMenuVisible }
          >
            <Tooltip
              overlayClassName='bookie-tooltip'
              placement='bottom'
              title={ I18n.t('topbar_tooltip.menu_more') }
            >
              <div className='icon-main dropdown-icon-main'>
                <a className='ant-dropdown-link' href='#'>
                  <i
                    className={
                      this.state.current === 'drop-down' && this.state.isSubMenuVisible
                        ? 'dropdown-icon-selected'
                        : 'dropdown-icon'
                    }
                  />
                </a>
              </div>
            </Tooltip>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }
}

TopMenu.defaultProps = {
  depositsEnabled: Config.features.deposits,
  withdrawalsEnabled: Config.features.withdrawels
};

const mapStateToProps = (state) => {
  // Check and assign features
  const account = state.get('account');
  const accountId = account.getIn(['account', 'id']);
  const setting =
    state.getIn(['setting', 'settingByAccountId', accountId]) ||
    state.getIn(['setting', 'defaultSetting']);
  const precision = state.getIn(['asset', 'assetsById', Config.coreAsset, 'precision']);
  let balance = state.getIn(['balance', 'availableBalancesByAssetId', Config.coreAsset, 'balance']);

  // Make Sure the balance is 0
  if (!balance || balance < 0) {
    balance = 0;
  }

  const convertedAvailableBalance = CurrencyUtils.getFormattedCurrency(
    balance / Math.pow(10, precision),
    setting.get('currencyFormat'),
    BettingModuleUtils.exposurePlaces,
    false
  );
  let availableBalance = balance !== undefined ? convertedAvailableBalance : 0;

  // in game balances is gained by summing matched bets and unmatched bets
  let inGameAmount = 0;
  state
    .getIn(['bet', 'unmatchedBetsById'])
    .filter((row) => !state.getIn(['bet', 'cancelBetsByIdsLoadingStatus']).get(row.get('id')))
    .forEach((row) => {
      inGameAmount += getStakeFromBetObject(row);
      inGameAmount += getProfitLiabilityFromBetObject(row);
    });
  state.getIn(['bet', 'matchedBetsById']).forEach((row) => {
    inGameAmount += getStakeFromBetObject(row);
    inGameAmount += getProfitLiabilityFromBetObject(row);
  });
  inGameAmount = CurrencyUtils.getFormattedCurrency(
    inGameAmount / Math.pow(10, precision),
    setting.get('currencyFormat'),
    BettingModuleUtils.stakePlaces
  );

  const isShowNotificationCard = state.getIn(['app', 'isShowNotificationCard']);
  const notificationsSelector = (state) => state.getIn(['notification', 'notifications']);
  const notifications = notificationsSelector(state);
  // Calculate unread notif
  const unreadNotificationNumberSelector = createSelector(
    notificationsSelector, 
    (notifications) => notifications
      .reduce((acc, notification) => acc + (notification.get('isRead') ? 0 : 1), 0)
  );
  
  const unreadNotificationNumber = unreadNotificationNumberSelector(state);

  return {
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    accountName: state.getIn(['account', 'account', 'name']),
    loadingStatus: state.getIn(['balance', 'getDepositAddressLoadingStatus']),
    depositAddress: state.getIn(['balance', 'depositAddress']),
    availableBalance: availableBalance,
    withdrawLoadingStatus: state.getIn(['balance', 'topMenuWithdrawLoadingStatus']),
    precision: precision,
    convertedAvailableBalance: convertedAvailableBalance,
    currencyFormat: setting.get('currencyFormat'),
    inGameAmount: inGameAmount,
    notifications,
    unreadNotificationNumber,
    isShowNotificationCard,
    routePath: state.getIn(['routing', 'locationBeforeTransitions']).pathname
    // Manual Feature Ovverides
    /*depositsEnabled: true,
    withdrawalsEnabled: true*/
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepositAddress: BalanceActions.getDepositAddress,
      navigateTo: NavigateActions.navigateTo,
      //TODO: Wallet Address verification and error response pending.
      withdraw: BalanceActions.topMenuWithdraw,
      resetWithdrawLoadingStatus: BalanceActions.resetTopMenuWithdrawLoadingStatus,
      logout: AuthActions.logoutAndShowPopupIfNeeded,
      markNotificationsAsRead: NotificationActions.markNotificationsAsReadAction,
      removeNotifications: NotificationActions.removeNotificationsAction,
      showSoftwareUpdatePopup: AppActions.showSoftwareUpdatePopupAction,
      showNotificationCard: AppActions.showNotificationCardAction,
      initialize: initialize
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopMenu);
