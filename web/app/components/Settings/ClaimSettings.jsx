import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import classNames from 'classnames';
import asset_utils from 'common/asset_utils';
import SettingsClaimActions from 'actions/SettingsClaimActions';

const mapStateToProps = (store) => {
  return {
    claim_error: store.pageSettings.claim_error,
    claim_balances: store.pageSettings.claim_balances
  };
};

@connect(mapStateToProps,
  {
    lookupBalances: SettingsClaimActions.lookupBalances,
    importBalance: SettingsClaimActions.importBalance,
    resetKey: SettingsClaimActions.resetKey,
    resetBalances: SettingsClaimActions.resetBalances,

  }
)
class ClaimSettings extends React.Component {

  constructor(props) {
    super(props);
    this.INIT_KEY = '';
    this.state = {
      owner_key: this.INIT_KEY
    };
    this.handleChange = this.handleChange.bind(this);
    this.lookupBalances = this.lookupBalances.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBalanceCancel = this.handleBalanceCancel.bind(this);
    this.importBalance = this.importBalance.bind(this);
  }

  componentWillUnmount() {
    this.props.resetKey();
  }

  handleChange(event) {
    this.setState({owner_key: event.target.value.trim()});
  }

  handleCancel() {
    this.setState({owner_key: this.INIT_KEY});
    this.props.resetKey();
  }

  handleBalanceCancel() {
    this.props.resetBalances();
  }

  lookupBalances() {
    setTimeout(() => {
      this.props.lookupBalances(this.state.owner_key);
    }, 0);
  }

  importBalance() {
    setTimeout(() => {
      this.props.importBalance().then(() => {
        this.setState({owner_key: this.INIT_KEY});
      });
    }, 0);
  }

  render() {
    let {claim_error, claim_balances} = this.props,
      totalAvailableBalance = 0;

    if (claim_balances && claim_balances.size > 0) {
      claim_balances.forEach((balance) => {
        let asset = balance.getIn(['balance', 'asset']),
          available_balance_amount = balance.getIn(['available_balance', 'amount']),
          availableBalanceAmount = asset && available_balance_amount
            ? available_balance_amount / Math.pow(10, asset.get('precision'))
            : 0;

        if (availableBalanceAmount) {
          totalAvailableBalance += availableBalanceAmount;
        }
      });
    }

    return (
      <div id='claim' className='tab__deploy' style={ {display: 'block'} }>
        <div className='tab__deployHead'>
          <div className='title'>
            <Translate component='span' className='' content='settings.claim_sharedrop.title' />
          </div>
        </div>
        <div className='box-inner box-inner-2'>

          <form className='clearfix' onSubmit={ (e) => {
            e.preventDefault();
          } }>
            <div className='col-6 col-offset-05'>
              <div className='row2'>
                <label className='label'>
                  <Translate
                    component='span'
                    className=''
                    content='settings.claim_sharedrop.owner_key'
                  />
                </label>
                <input
                  autoFocus
                  type='text'
                  className={ classNames('field field-type3', {error: !!claim_error}) }
                  placeholder={
                    counterpart.translate('settings.claim_sharedrop.placeholder_key_filed')
                  }
                  value={ this.state.owner_key }
                  onChange={ this.handleChange }
                />
                {claim_error ? <span className='error__hint'>{claim_error}</span> : null}
              </div>
              <div className='row2 rowOptions'>
                <button
                  className='btn btn-neutral'
                  type='button'
                  onClick={ this.handleCancel }
                >
                  <Translate
                    component='span'
                    className=''
                    content='settings.claim_sharedrop.cancel_button'
                  />
                </button>
                <button
                  className='btn btn-success'
                  type='button'
                  onClick={ this.lookupBalances }
                >
                  <Translate
                    component='span'
                    className=''
                    content='settings.claim_sharedrop.lookup_button'
                  />
                </button>
              </div>
            </div>
          </form>
          <div className='h-40'></div>
          <div className='table table2 table-settings-claim'>
            <div className='table__head tableRow'>
              <div className='tableCell'>
                <Translate
                  component='span'
                  className=''
                  content='settings.claim_sharedrop.unclaimed_available'
                />
              </div>
              <div className='tableCell'>
                <Translate
                  component='span'
                  className=''
                  content='settings.claim_sharedrop.unclaimed_vesting'
                />
              </div>
              <div className='tableCell'>
                <Translate
                  component='span'
                  className=''
                  content='settings.claim_sharedrop.account_name'
                />
              </div>
            </div>
            <div className='table__body'>
              {claim_balances.map((balance) => {
                let asset = balance.getIn(['balance', 'asset']),
                  amount = balance.getIn(['balance', 'amount']),
                  accounts = balance.get('accounts'),
                  available_balance_amount = balance.getIn(['available_balance', 'amount']);
                let availableBalanceAmount = asset && available_balance_amount
                  ? available_balance_amount / Math.pow(10, asset.get('precision'))
                  : 0;
                let vestedBalance = (asset && amount && (amount - available_balance_amount) > 0)
                  ? (amount - available_balance_amount) / Math.pow(10, asset.get('precision'))
                  : 0;
                let assetSymbol = asset_utils.getSymbol(
                  balance.getIn(['balance', 'asset', 'symbol'])
                );

                return (
                  <div key={ balance.get('id') } className='tableRow'>
                    <div className='tableCell'> {availableBalanceAmount} {assetSymbol}</div>
                    <div className='tableCell'>
                      <span className='upp'>{vestedBalance} {assetSymbol}</span>
                    </div>
                    <div className='tableCell'>{accounts ? accounts.join(', ') : ' - '}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {
            claim_balances && claim_balances.size > 0
              ? <div className='table2__btns'>
                <button
                  className='btn btn-neutral'
                  type='button'
                  onClick={ this.handleBalanceCancel }
                >
                  <Translate
                    component='span'
                    className=''
                    content='settings.claim_sharedrop.cancel_button'
                  />
                </button>
                <button
                  className='btn btn-success'
                  disabled={ !totalAvailableBalance }
                  type='button'
                  onClick={ this.importBalance }
                >
                  <Translate
                    component='span'
                    className=''
                    content='settings.claim_sharedrop.claim_balance_button'
                  />
                </button>
              </div>
              : null
          }
        </div>
      </div>
    );
  }
}

export default ClaimSettings;