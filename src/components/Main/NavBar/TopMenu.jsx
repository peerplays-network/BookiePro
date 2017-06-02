import React, { Component } from 'react';
import { Badge, Menu,Dropdown } from 'antd';
import Deposit from '../../MyAccount/Deposit'
//import Withdraw from '../../MyAccount/Withdraw'
import { TopMenuWithdraw } from '../../Withdraw';
import Amount from './AmountDropDown'
import Notification from './Notification'
import DropdownMenu from './DropdownMenu'
import { BetActions, AuthActions, BalanceActions, NotificationActions, NavigateActions, AppActions } from '../../../actions';
import { NotificationTypes } from '../../../constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { CurrencyUtils, BettingModuleUtils } from '../../../utility';
import { createSelector } from 'reselect';
import { initialize } from 'redux-form';

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'smile',
      withdrawAmount:'',
      isSubMenuVisible: false,
      isNotificationCardVisible: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
    this.handleNotificationCardItemClick = this.handleNotificationCardItemClick.bind(this);
    this.handleNotificationCardItemClickClose = this.handleNotificationCardItemClickClose.bind(this);
    this.handleNotificationCardVisibleChange = this.handleNotificationCardVisibleChange.bind(this);
  }

  handleWithdrawSubmit(values){
    //track the withdraw amount to display in success message after successfull submit
    this.setState({withdrawAmount:values.get('topMenuWithdrawAmount')});
    this.props.withdraw(values.get('topMenuWithdrawAmount'), values.get('topMenuWalletAddr'));
  }

  handleNotificationCardVisibleChange(visible) {
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
        this.props.showSoftwareUpdatePopup(true);
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
    this.setState((prevState) => {
      return { isNotificationCardVisible: false }
    })

  }

  componentDidMount(){
    //Get the deposit address
    this.props.getDepositAddress();
    //Get unmatched and matched bets to calculate inGameAmount
    this.props.getOngoingBets();
  }

  handleClick(e) {
    //TODO:handle selected menu
    event.preventDefault();

    this.setState({
      current: e.key,
    });

    switch (e.key) {
      case 'mywager':
        this.props.navigateTo('/my-wager');
        break;
      case 'myaccount':
        this.props.navigateTo('/my-account');
        this.setState({ isSubMenuVisible: false });
        break;
      case 'help':
        this.props.navigateTo('/help-and-support');
        break;
      case 'logout':
        this.props.logout();
        this.setState({ isSubMenuVisible: false });
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
  handleSubMenuVisibleChange = (flag) => {
    this.setState({ isSubMenuVisible: flag });
  }

  render() {
    const amountCard = (
      <Amount cardClass='bookie-amount-card'
        availableBalance={ this.props.availableBalance }
        inGameAmount={ this.props.inGameAmount }/>
    );
    const depositCard = (depositAddress) => (
      <Deposit cardClass='bookie-card deposit-card depositCardComponent' depositAddress={ depositAddress } />
    );
    const withdrawCard = (
      <TopMenuWithdraw cardClass='bookie-card withdraw-card withdrawComponent'
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
      <DropdownMenu cardClass='menu-card' onSubmenuClick={ this.handleClick } />
    );
    const notificationCard = (
      <Notification
        notifications={ this.props.notifications }
        onClickItem={ this.handleNotificationCardItemClick }
        onClickCloseItem={ this.handleNotificationCardItemClickClose }
      />
    );
    return (
      <Menu
        className='top-menu'
        theme='dark'
        onClick={ this.handleClick }
        selectedKeys={ [this.state.current] }
        mode='horizontal'
      >
        <Menu.Item key='balance' className='amount'>
          <Dropdown trigger={ ['click'] } overlay={ amountCard } placement='bottomRight'>
            <div className='icon-main bitcoin-icon-main'>
              <a className='ant-dropdown-link' href='#'>
                <i className={ this.props.currencyFormat === 'BTC' ? 'bitcoin-icon' : 'mbitcoin-icon' }></i>
                { this.props.availableBalance }
              </a>
            </div>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='mywager'>
          <div className='icon-main mywager-icon-main'>
            <i className='mywager-icon'></i>
          </div>
        </Menu.Item>
        <Menu.Item key='deposit'>
          <Dropdown trigger={ ['click'] } overlay={ depositCard(this.props.depositAddress) } placement='bottomRight'>
            <div className='icon-main deposit-icon-main'>
              <a className='ant-dropdown-link' href='#'>
                <i className='deposit-icon'></i>
              </a>
            </div>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='withdraw'>
          <Dropdown trigger={ ['click'] } overlay={ withdrawCard } placement='bottomRight'>
            <div className='icon-main withdraw-icon-main'>
              <a className='ant-dropdown-link'>
                <i className='withdraw-icon'></i>
              </a>
            </div>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='notifications' className='notification'>
          <Dropdown
            trigger={ ['click'] }
            overlay={ notificationCard }
            placement='bottomRight'
            visible={ this.props.isShowNotificationCard }
            onVisibleChange={ this.handleNotificationCardVisibleChange }
          >
            <div className='icon-main notification-icon-main'>
              <a className='ant-dropdown-link' href='#'>
              <Badge count={ this.props.unreadNotificationNumber }>
                <i className='notification-icon'></i>
              </Badge>
            </a>
            </div>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='drop-down'>
          <Dropdown key='drop-down-item' trigger={ ['click'] }
            overlay={ dropdownMenuCard } placement='bottomRight'
            onVisibleChange={ this.handleSubMenuVisibleChange }
            visible={ this.state.isSubMenuVisible }>
            <div className='icon-main dropdown-icon-main'>
              <a className='ant-dropdown-link' href='#'>
                <i className='dropdown-icon'></i>
              </a>
            </div>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  const account = state.get('account');
  const accountId = account.getIn(['account','id']);
  const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting']) ;
  const precision = state.getIn(['asset', 'assetsById', '1.3.0', 'precision']);
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset '1.3.0' is not obtained for some reason
  */
  const balance = state.getIn(['balance', 'availableBalancesByAssetId', '1.3.0', 'balance']);
  const convertedAvailableBalance = CurrencyUtils.getFormattedCurrency(balance/ Math.pow(10, precision), setting.get('currencyFormat'), BettingModuleUtils.exposurePlaces);
  let availableBalance = balance !== undefined ? convertedAvailableBalance : -1;

  // in game balances is gained by summing matched bets and unmatched bets
  let inGameAmount = 0;
  state.getIn(['bet','unmatchedBetsById'])
  .filter(row => !state.getIn(['bet','cancelBetsByIdsLoadingStatus']).get(row.get('id')))
  .forEach(row => {
    inGameAmount += row.get('amount_to_bet');
  });
  state.getIn(['bet','matchedBetsById']).forEach(row => {
    inGameAmount += row.get('amount_to_bet');
  });
  inGameAmount = CurrencyUtils.getFormattedCurrency(inGameAmount/ Math.pow(10, precision), setting.get('currencyFormat'), BettingModuleUtils.stakePlaces)

  const isShowNotificationCard = state.getIn(['app', 'isShowNotificationCard']);
  const notificationsSelector = (state) => state.getIn(['notification', 'notifications']);
  const notifications = notificationsSelector(state);
  // Calculate unread notif
  const unreadNotificationNumberSelector = createSelector(
    notificationsSelector,
    (notifications) => {
      return notifications.reduce((acc, notification) => {
        return acc + (notification.get('isRead') ? 0 : 1);
      }, 0)
    }
  )
  const unreadNotificationNumber = unreadNotificationNumberSelector(state);

  return {
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
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
    routePath: state.getIn(['routing', 'locationBeforeTransitions','pathname'])
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDepositAddress: BalanceActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo,
    //TODO: Wallet Address verification and error response pending.
    withdraw: BalanceActions.topMenuWithdraw,
    resetWithdrawLoadingStatus: BalanceActions.resetTopMenuWithdrawLoadingStatus,
    logout: AuthActions.logoutAndShowPopupIfNeeded,
    getOngoingBets: BetActions.getOngoingBets,
    markNotificationsAsRead: NotificationActions.markNotificationsAsReadAction,
    removeNotifications: NotificationActions.removeNotificationsAction,
    showSoftwareUpdatePopup: AppActions.showSoftwareUpdatePopupAction,
    showNotificationCard: AppActions.showNotificationCardAction,
    initialize: initialize
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
