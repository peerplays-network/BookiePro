import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

@connect((state) => {
  return {
    name: state.transactionConfirm.transaction.name,
    registrar: state.transactionConfirm.transaction.registrar,
    referrer: state.transactionConfirm.transaction.referrer
  };
})

class AccountCreate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.account_create' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.name' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.name}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='account.member.registrar' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.registrar}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'><Translate content='account.name' /></div>
            <div className='mConf__tableRight'>
              {this.props.referrer}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountCreate;
