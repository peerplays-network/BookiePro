import React, { Component } from 'react';
import { Badge, Menu, Icon,Dropdown } from 'antd';
import Deposit from '../../MyAccount/Deposit'
import Withdraw from '../../MyAccount/Withdraw'
import Amount from './AmountDropDown'
import Notification from './Notification'
import DropdownMenu from './DropdownMenu'
import { AccountActions } from '../../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../../actions';

class TopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 'smile',
      withdrawAmount:''
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
        break;
      case 'help':
        //TODO: add navigation action for help page
        break;
      case 'logout':
        //TODO: add action for logout
        break;
      default:
    }
  }

  render() {
    const amountCard = (
      <Amount cardClass='bookie-amount-card' />
    );
    const depositCard = (depositAddress) => (
      <Deposit cardClass='bookie-card deposit-card' depositAddress={ depositAddress } />
    );
    const withdrawCard = (
      <Withdraw cardClass='bookie-card withdraw-card'
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
            <a className='ant-dropdown-link' href='#'>
              1.234444
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='mywager'>
          <Icon type='calendar' />
        </Menu.Item>
        <Menu.Item key='deposit'>
          <Dropdown trigger={ ['click'] } overlay={ depositCard(this.props.depositAddress) } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Icon type='pay-circle-o' />
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='withdraw'>
          <Dropdown trigger={ ['click'] } overlay={ withdrawCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Icon type='pay-circle-o' />
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='notifications' className='notification'>
          <Dropdown trigger={ ['click'] } overlay={ notificationCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Badge count={ 5 }>
                <Icon type='notification' />
              </Badge>
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='drop-down'>
          <Dropdown key='drop-down-item' trigger={ ['click'] } overlay={ dropdownMenuCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Icon type='menu-fold' />
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  const account = state.get('account');
  return {
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    loadingStatus: account.get('getDepositAddressLoadingStatus'),
    depositAddress: account.get('depositAddress'),
    availableBalance: account.get('availableBalance'),
    withdrawLoadingStatus: account.get('withdrawLoadingStatus'),
    currencyFormat: state.get('setting').get('currencyFormat'),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDepositAddress: AccountActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo,
    withdraw: AccountActions.withdraw
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
