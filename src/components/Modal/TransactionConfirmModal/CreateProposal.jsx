import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {FormattedNumber, FormattedDate} from 'react-intl';
import assetUtils from 'common/asset_utils';

class CreateProposal extends React.Component {
  render() {
    const expiration_date = new Date((this.props.expiration_time + 86400) * 1000 );
    const has_review_period = this.props.review_period_seconds !== undefined;
    const review_begin_time = ! has_review_period
      ? null :
      expiration_date.getTime() -this.props.review_period_seconds * 1000;
    let feeValue = this.props.fee
      ? this.props.fee.amount / Math.pow(10, this.props.fee.asset.precision)
      : 0;
    let feeSymbol = this.props.fee
      ? this.props.fee.asset.symbol
      : null;

    return (
      <div className='mConf__table'>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'>
            <Translate content='proposal_create.review_period' />
          </div>
          <div className='mConf__tableRight'>
            <span className='mark2'>
              { has_review_period
                ? <FormattedDate
                  value={ new Date( review_begin_time ) }
                  format='full'/>
                :<span>&mdash;</span>}
            </span>
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'>
            <Translate content='proposal_create.expiration_time' />
          </div>
          <div className='mConf__tableRight'>
            <span className='mark2'>
              <FormattedDate
                value={ expiration_date }
                format='full'
              />
            </span>
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'>
            <Translate content='proposal_create.proposed_operations' />
          </div>
          <div className='mConf__tableRight'>
            {this.props.proposed_operations}
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'>
            <Translate content='proposal_create.fee_paying_account' />
          </div>
          <div className='mConf__tableRight'>
            {this.props.fee_paying_account}
          </div>
        </div>
        <div className='mConf__tableRow'>
          <div className='mConf__tableLeft'>
            <Translate content='transfer.fee' />
          </div>
          <div className='mConf__tableRight'>
            <FormattedNumber
              value={ feeValue }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ this.props.fee.asset.precision }
            /> {assetUtils.getSymbol(feeSymbol)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    review_period_seconds: state.transactionConfirm.transaction.review_period_seconds,
    expiration_time: state.transactionConfirm.transaction.expiration_time,
    proposed_operations: state.transactionConfirm.transaction.proposed_operations,
    fee_paying_account: state.transactionConfirm.transaction.fee_paying_account,
    fee: state.transactionConfirm.transaction.fee
  };
};

export default connect(mapStateToProps)(CreateProposal);
