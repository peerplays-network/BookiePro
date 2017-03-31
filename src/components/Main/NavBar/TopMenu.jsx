import React, { Component } from 'react';
import { Badge, Menu, Icon,Dropdown} from 'antd';
import Deposit from '../../MyAccount/Deposit'
import Withdraw from '../../MyAccount/Withdraw'
import Amount from './AmountDropDown'
import Notification from './Notification'
import DropdownMenu from './DropdownMenu'
import { AccountActions } from '../../../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'

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
  <DropdownMenu cardClass='menu-card' />
);
const notificationCard = (
  <Notification cardClass='notification-card' />
);
console.log(depositCard);
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
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  //TODO: change href to actions
  render() {
    return (
      <Menu
        className='top-menu'
        theme='dark'
        onClick={ this.handleClick }
        selectedKeys={ [this.state.current] }
        mode='horizontal'
      >
        <Menu.Item key='money' className='amount'>
          <Dropdown trigger={ ['click'] } overlay={ amountCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              1.234444
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='smile'>
          <a href='/#/my-wager'> <Icon type='calendar' /> </a>
        </Menu.Item>
        <Menu.Item key='deposit'>
          <Dropdown trigger={ ['click'] } overlay={ depositCard(this.props.depositAddress) } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Icon type='pay-circle-o' />
            </a>
          </Dropdown>

        </Menu.Item>
        <Menu.Item key='withdrawn'>
          <Dropdown trigger={ ['click'] } overlay={ withdrawCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Icon type='pay-circle-o' />
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='star' className='notification'>
          <Dropdown trigger={ ['click'] } overlay={ notificationCard } placement='bottomRight'>
            <a className='ant-dropdown-link' href='#'>
              <Badge count={ 5 }>
                <Icon type='notification' />
              </Badge>
            </a>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key='drop-down'>
          <Dropdown trigger={ ['click'] } overlay={ dropdownMenuCard } placement='bottomRight'>
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
    depositAddress: account.get('depositAddress')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDepositAddress: AccountActions.getDepositAddress,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
