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
    };

    this.handleClick = this.handleClick.bind(this);
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
            <div className='icon-main bitcoin-icon-main'>
              <a className='ant-dropdown-link' href='#'>
                <i className='bitcoin-icon'></i>
                1.234444
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
          <Dropdown key='drop-down-item' trigger={ ['click'] } overlay={ dropdownMenuCard } placement='bottomRight'>
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
