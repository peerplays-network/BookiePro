import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';

class ProposalUpdate extends React.Component {
  render() {
    let fields = [ /* eslint-disable-line */
      'active_approvals_to_add', 'active_approvals_to_remove',
      'owner_approvals_to_add', 'owner_approvals_to_remove',
      'key_approvals_to_add', 'key_approvals_to_remove'
    ];

    return (
      <div className='mConf__content'>
        <div className='mConf__title'>
          <Translate content='transaction.trxTypes.proposal_update' />
        </div>
        <div className='mConf__table'>
          <div className='mConf__tableRow'>
            <div className='mConf__tableLeft'>
              <Translate content='proposal_create.fee_paying_account' />
            </div>
            <div className='mConf__tableRight'>
              <span className='mark2'>
                {this.props.op.fee_paying_account}
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
    op : state.transactionConfirm.transaction.op
  };
};

export default connect(mapStateToProps)(ProposalUpdate);
