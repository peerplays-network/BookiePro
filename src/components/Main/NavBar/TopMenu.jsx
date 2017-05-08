import React, { Component } from 'react';
import { Badge, Menu,Dropdown } from 'antd';
import Deposit from '../../MyAccount/Deposit'
import Withdraw from '../../MyAccount/Withdraw'
import Amount from './AmountDropDown'
import Notification from './Notification'
import DropdownMenu from './DropdownMenu'
import { BetActions, AuthActions, BalanceActions } from '../../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../../actions';
import { CurrencyUtils, BettingModuleUtils } from '../../../utility';

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'smile',
      withdrawAmount:'',
      isSubMenuVisible: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
  }

  handleWithdrawSubmit(values){
    //track the withdraw amount to display in success message after successfull submit
    this.setState({withdrawAmount:values.get('withdrawAmount')});
    this.props.withdraw(values.get('withdrawAmount'), values.get('walletAddr'));
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
        //TODO: add navigation action for help page
        break;
      case 'logout':
        this.props.logout();
        this.setState({ isSubMenuVisible: false });
        break;
      default:
    }
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
      <Withdraw cardClass='bookie-card withdraw-card withdrawComponent'
        currencyFormat={ this.props.currencyFormat }
        availableBalance={ this.props.availableBalance }
        onSubmit={ this.handleWithdrawSubmit }
        withdrawLoadingStatus={ this.props.withdrawLoadingStatus }
        withdrawAmount={ this.state.withdrawAmount }
        />
    );
    const dropdownMenuCard = (
      <DropdownMenu cardClass='menu-card' onSubmenuClick={ this.handleClick } />
    );
    const notificationCard = (
      <Notification cardClass='notification-card' />
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
              <a className='ant-dropdown-link' href='#'>
                <i className='withdraw-icon'></i>
              </a>
            </div>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='notifications' className='notification'>
          <Dropdown trigger={ ['click'] } overlay={ notificationCard } placement='bottomRight'>
            <div className='icon-main notification-icon-main'>
              <a className='ant-dropdown-link' href='#'>
              <Badge count={ 5 }>
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
  const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting']) ;
  const precision = state.getIn(['asset', 'assetsById', '1.3.0']).get('precision');
  /*-1 will be used to check to display 'Not available' against the withdraw amount field
      when the asset '1.3.0' is not obtained for some reason
  */
  const balance = state.getIn(['balance', 'availableBalancesByAssetId', '1.3.0', 'balance']);
  let availableBalance = balance !== undefined ?
    CurrencyUtils.getFormattedCurrency(balance/ Math.pow(10, precision), setting.get('currencyFormat'), BettingModuleUtils.exposurePlaces) : -1;

  //since we don't have any API to get inGameBalances, we summing unmatched and matched bets
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

  return {
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    loadingStatus: state.getIn(['balance', 'getDepositAddressLoadingStatus']),
    depositAddress: state.getIn(['balance', 'depositAddress']),
    availableBalance: availableBalance,
    withdrawLoadingStatus: state.getIn(['balance', 'withdrawLoadingStatus']),
    currencyFormat: setting.get('currencyFormat'),
    inGameAmount: inGameAmount
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDepositAddress: BalanceActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo,
    //TODO: Wallet Address verification and error response pending.
    withdraw: BalanceActions.withdraw,
    logout: AuthActions.logoutAndShowPopupIfNeeded,
    getOngoingBets: BetActions.getOngoingBets
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
