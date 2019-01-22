import React from 'react';
import BalanceClaimActive from 'components/Wallet/BalanceClaimActive';
import Translate from 'react-translate-component';
import ChangeCurrentWallet from 'components/Wallet/ChangeCurrentWallet';
import DeleteWallet from 'components/Wallet/Delete';

export default class WalletSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lookupActive: false
    };
  }

  onLookup() {
    this.setState({
      lookupActive: !this.state.lookupActive
    });
  }

  render() {
    let {lookupActive} = this.state;

    return (
      <div>
        <ChangeCurrentWallet />
        <DeleteWallet />
        <section style={ {padding: '15px 0'} } className='block-list'>
          <header><Translate content='wallet.balance_claims' />:</header>
        </section>
        <div style={ {paddingBottom: 10} }>
          <Translate content='settings.lookup_text' />:
        </div>
        <div className='button outline' onClick={ this.onLookup.bind(this) }>Lookup balances</div>
        {lookupActive ? <BalanceClaimActive /> : null}
      </div>
    );
  }
};
