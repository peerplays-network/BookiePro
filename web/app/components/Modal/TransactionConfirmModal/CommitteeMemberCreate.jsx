import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class CommitteeMemberCreate extends React.Component {
  render() {
    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.committee_member_create' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='explorer.committee_member.title' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.committee_member_account}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    committee_member_account : state.transactionConfirm.transaction.committee_member_account
  };
};

export default connect(mapStateToProps)(CommitteeMemberCreate);
