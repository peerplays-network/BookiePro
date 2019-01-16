import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';


@connect((state) => {
  return {
    authorizing_account: state.transactionConfirm.transaction.authorizing_account,
    account_to_list: state.transactionConfirm.transaction.account_to_list,
    listing: state.transactionConfirm.transaction.listing
  };
})
class AccountWhiteList extends React.Component {

  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.account_whitelist' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.authorizing_account' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.authorizing_account}
              </span>
            </div>
          </div>

          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.listed_account' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.account_to_list}
              </span>
            </div>
          </div>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.block.new_listing' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                <Translate content={ `transaction.whitelist_states.${this.props.listing}` } />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountWhiteList;
