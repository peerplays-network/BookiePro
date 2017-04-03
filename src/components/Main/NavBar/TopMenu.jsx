import React, { Component } from 'react';
import { Badge, Menu, Icon, Dropdown } from 'antd';
import Deposit from '../../MyAccount/Deposit';
import Withdraw from '../../MyAccount/Withdraw';
import Amount from './AmountDropDown';
import Notification from './Notification';
import DropdownMenu from './DropdownMenu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigateActions } from '../../../actions';

class TopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 'smile',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    //Get the deposit address
    this.props.getDepositAddress();
  }

  handleClick(e) {
    //TODO:handle selected menu
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
    const depositCard = (
      <Deposit cardClass='bookie-card deposit-card' />
    );
    const withdrawCard = (
      <Withdraw cardClass='bookie-card withdraw-card' />
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
              <Icon type='pay-circle-o' />
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='withdraw'>
          <Dropdown trigger={ ['click'] } overlay={ withdrawCard } placement='bottomRight'>
              <Icon type='pay-circle-o' />
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='notifications' className='notification'>
          <Dropdown trigger={ ['click'] } overlay={ notificationCard } placement='bottomRight'>
              <Badge count={ 5 }>
                <Icon type='notification' />
              </Badge>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='drop-down'>
          <Dropdown key='drop-down-item' trigger={ ['click'] } overlay={ dropdownMenuCard } placement='bottomRight'>
              <Icon type='menu-fold' />
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
    depositAddress: account.get('depositAddress')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDepositAddress: AccountActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
