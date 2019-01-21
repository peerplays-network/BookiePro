import React, {Component} from 'react';
import cname from 'classnames';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import LoadingIndicator from '../LoadingIndicator';

class BalanceClaimActive extends Component {
  render() {
    if (!this.props.account_refs.size) {
      return (
        <div>
          <h5><Translate content='wallet.no_balance'/></h5>
        </div>
      );
    }

    if (this.props.loading) {
      return (
        <div>
          <br/>
          <h5><Translate content='wallet.loading_balances'/>&hellip;</h5>
          <br/>
          <LoadingIndicator type='three-bounce'/>
        </div>
      );
    }

    if (!this.props.balances || !this.props.balances.size) {
      return (
        <div>
          <br/>
          <h5><Translate content='wallet.no_balance'/></h5>
        </div>
      );
    }

    var import_ready = this.props.selected_balances.size && this.props.claim_account_name;
    var claim_balance_label = import_ready
      ? ` (${this.props.claim_account_name})`
      : null;

    return (
      <div>
        <div className='content-block center-content'>
          <h3 className='no-border-bottom'><Translate content='wallet.claim_balances'/></h3>
        </div>
        <div className='grid-block vertical'>
          <div
            className='grid-content'
            style={ {
              overflowY: 'hidden !important'
            } }>
            <div className='full-width-content center-content'>
              {/* <MyAccounts
                key={ this.props.balances }
                accounts={ Immutable.List(this.props.account_refs) }
                onChange={ this.onClaimAccountChange.bind(this) }/> */}
            </div>
            <br></br>
          </div>
          <br/>
          {/* <BalanceClaimSelector/> */}
        </div>
        <br/><br/>
        <div
          className={ cname('button success', {
            disabled: !import_ready
          }) }
          onClick={ this.onClaimBalance.bind(this) }>
          <Translate content='wallet.claim_balance'/>{claim_balance_label}</div>
        <div
          className='button cancel'
          onClick={ this.onBack.bind(this) }><Translate content='wallet.cancel'/></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account_refs: state.accountRefs.account_refs,
    pubkeys: state.balanceClaimActive.pubkeys,
    addresses: state.balanceClaimActive.addresses,
    walletNames: state.balanceClaimActive.walletNames,
    address_to_pubkey: state.balanceClaimActive.address_to_pubkey,
    state: state.balanceClaimActive.state
  };
};

export default connect(mapStateToProps)(BalanceClaimActive);