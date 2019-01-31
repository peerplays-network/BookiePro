import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {ReferralsPageActions} from '../../actions';
import AccountMemberService from 'services/AccountMemberService';
import {bindActionCreators} from 'redux';

class Referrals extends React.Component {
  componentWillMount() {
    this.props.setPageData();
    this.props.subscribe();
  }

  componentWillUnmount() {
    this.props.unSubscribe();
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
    let expiration = null;

    if (member_status === 'annual' ) {
      expiration = (
        <span>
        (<Translate content='account.member.expires'/>
          {account.get('membership_expiration_date')})
        </span>
      );
    }

    let expiration_date = account.get('membership_expiration_date');

    if (expiration_date === '1969-12-31T23:59:59') {
      expiration_date = 'Never';
    } else if (expiration_date === '1970-01-01T00:00:00') {
      expiration_date = 'N/A';
    }

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <h1 className='content__headTitle'><Translate content='account.member.referrals'/></h1>
            <h3><Translate content={ membership }/> {expiration}</h3>
            <div>
              <Translate content='account.member.membership_expiration'/>: {expiration_date}
            </div>
            {
              member_status=== 'lifetime'
                ? <button type='button' className='btn btn-content__head' disabled={ true }>
                  <span className='content__headBtnIcon icon-arrows3'/>
                  <span className=''><Translate content='account.member.upgrade_lifetime'/></span>
                </button>
                : (
                  <button
                    type='button'
                    className='btn btn-content__head'
                    onClick={ this.onClickUpgradeLifetime.bind(this) }
                  >
                    <span className='content__headBtnIcon icon-arrows3'/>
                    <span className=''><Translate content='account.member.upgrade_lifetime'/></span>
                  </button>
                )
            }
            <div className='h100'></div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.referralsPageReducer.account
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    onClickUpgradeLifetime: ReferralsPageActions.onClickUpgradeLifetime,
    setPageData: ReferralsPageActions.setPageData,
    subscribe: ReferralsPageActions.subscribe,
    unSubscribe: ReferralsPageActions.unSubscribe
  },
  dispatch
);


export default connect(mapStateToProps, mapDispatchToProps)(Referrals);