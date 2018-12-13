import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import VestingBalance from './VestingBalance';
import AccountVestingPageActions from 'actions/AccountVestingPageActions';

@connect((state) => {
  return {balances: state.accountVestingPageReducer.balances};
}, {
  fetchData: AccountVestingPageActions.fetchData,
  claimVestingBalance: AccountVestingPageActions.claimVestingBalance,
  resetAccountVestingData: AccountVestingPageActions.resetAccountVestingData
})
class VestingAccountContainer extends React.Component {

  componentWillMount() {
    this.props.fetchData();
  }

  componentWillUnmount() {
    this.props.resetAccountVestingData();
  }

  onHandleClaimClick(vb) {
    this.props.claimVestingBalance(vb);
  }

  render() {
    let {balances} = this.props,
      symbol = CORE_ASSET; // eslint-disable-line

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <div className='table__section'>
              <div className='table__title type2'>
                <Translate content='vesting_balances.title'/>
                {(symbol)
                  ? `(${symbol})`
                  : null}:
              </div>
              <div className='table table2 table-vBalances'>
                <div className='table__head tableRow'>
                  <div className='tableCell'>
                    <Translate content='vesting_balances.balance_number'/>
                  </div>
                  <div className='tableCell'>
                    <Translate content='vesting_balances.cashback'/>
                  </div>
                  <div className='tableCell text_r'>
                    <Translate content='vesting_balances.earned'/>
                  </div>
                  <div className='tableCell text_r'>
                    <Translate content='vesting_balances.required'/>
                  </div>
                  <div className='tableCell text_r'>
                    <Translate content='vesting_balances.remaining'/>
                  </div>
                  <div className='tableCell '>
                    <Translate content='vesting_balances.available'/>
                  </div>
                  <div className='tableCell text_c'></div>
                </div>
                <div className='table__body'>
                  {balances.map((vb) => {
                    return (
                      <VestingBalance
                        key={ vb.id }
                        handleClaimClick={ this.onHandleClaimClick.bind(this) }
                        vb={ vb }/>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default VestingAccountContainer;