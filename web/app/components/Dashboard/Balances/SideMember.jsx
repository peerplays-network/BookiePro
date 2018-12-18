import React from 'react';
import {connect} from 'react-redux';
import AccountMemberService from 'services/AccountMemberService';
import Translate from 'react-translate-component';
import ReferralsPageActions from 'actions/ReferralsPageActions';

@connect((state) => {
  return {account: state.dashboardPage.memberAccount};
}, {onClickUpgradeLifetime: ReferralsPageActions.onClickUpgradeLifetime})
class SideMember extends React.Component {

  navigateToVestingBalances() {
    this.props.navigateToVestingBalances();
  }
  onClickUpgradeLifetime() {
    this.props.onClickUpgradeLifetime();
  }
  render() {
    let account = this.props.account;

    if (!account) {
      return null;
    }

    let member_status = AccountMemberService.getAccountMemberStatus(this.props.account);
    let membership = 'account.member.' + member_status;

    return (
      <div className='aside__item'>
        <div className='aside__title'>
          <Translate content='account.member.rewards_club'/>:
        </div>
        <div className='aside__row'>
          <div className='aside__num'>
            <Translate content={ membership }/>
          </div>
        </div>
        <div className='aside__btnWrap'>
          {member_status === 'lifetime'
            ? null
            : <button
              className='btn aside__btn'
              onClick={ this.onClickUpgradeLifetime.bind(this) }>
              <span className='aside__btnIcon icon-rocket'></span>
              <span className=''>
                <Translate content='account.member.join_now'/>
              </span>
            </button>
          }
        </div>
      </div>
    );
  }
}

export default SideMember;
