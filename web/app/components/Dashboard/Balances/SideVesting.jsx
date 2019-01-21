import React from 'react';
import {connect} from 'react-redux';
import {FormattedNumber} from 'react-intl';
import {NavigateActions} from '../../../actions';
import asset_utils from 'common/asset_utils';
import Translate from 'react-translate-component';
import {getTotalVestingBalances} from 'selectors/SideVesting';
import {bindActionCreators} from 'redux';

class SideVesting extends React.Component {
  navigateToVestingBalances() {
    this.props.navigateToVestingBalances();
  }

  render() {
    let {asset, totalAmount, totalClaimable} = this.props, symbol;

    if (asset) {
      symbol = asset_utils.getSymbol(asset.get('symbol'));
    }

    return (
      <div className='aside__item bb'>
        <Translate
          component='div'
          className='aside__title'
          content='dashboard.side.vesting_balances'
        />
        <div className='aside__row'>
          <Translate
            component='div'
            className='aside__rowLabel2'
            content='dashboard.side.total'
          />

          <div className='aside__unit'>
            {symbol}
          </div>

          <div className='aside__num'>
            {totalAmount && asset
              ? <FormattedNumber
                value={
                  totalAmount
                    ? totalAmount / Math.pow(10, asset.get('precision'))
                    : totalAmount
                }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ asset.get('precision') }
              />
              : 0
            }
          </div>
        </div>
        <div className='aside__row'>
          <Translate
            component='div'
            className='aside__rowLabel2'
            content='dashboard.side.claimable'
          />

          <div className='aside__unit'>
            {symbol}
          </div>

          <div className='aside__num'>
            {totalClaimable && asset
              ? <FormattedNumber
                value={
                  totalClaimable
                    ? totalClaimable / Math.pow(10, asset.get('precision'))
                    : totalClaimable
                }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ asset.get('precision') }
              />
              : 0
            }
          </div>
        </div>

        <div className='aside__btnWrap'>
          <button
            className='btn aside__btn'
            type='button'
            onClick={ this.navigateToVestingBalances.bind(this) }>
            <span className='aside__btnIcon icon-claim'></span>
            <Translate
              component='span'
              className=''
              content='dashboard.side.claim_balances'
            />
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let data = getTotalVestingBalances(state);

  return {
    totalAmount: data.totalAmount,
    totalClaimable: data.totalClaimable,
    asset: state.dashboardPage.vestingAsset
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateToVestingBalances: NavigateActions.navigateToVestingBalances
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SideVesting);
