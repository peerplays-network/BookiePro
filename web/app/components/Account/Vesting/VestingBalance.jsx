import React from 'react';
import utils from 'common/utils';
import {FormattedNumber} from 'react-intl';
import Translate from 'react-translate-component';

class VestingBalance extends React.Component {
  handleClaimClick() {
    this.props.handleClaimClick(this.props.vb);
  }

  render() {
    let {vb} = this.props;

    if (!vb || !vb.balance.amount) {
      return null;
    }

    let cvbAsset = vb.balance.asset,
      vestingPeriod = vb.policy[1].vesting_seconds,
      earned = vb.policy[1].coin_seconds_earned,
      secondsPerDay = 60 * 60 * 24,
      balance = vb.balance.amount,
      availablePercent = earned / (vestingPeriod * balance),
      precision = vb.balance.asset
        ? vb.balance.asset.get('precision')
        : 0;

    return (
      <div key={ vb.id } className='tableRow'>
        <div className='tableCell'>{vb.id}</div>
        <div className='tableCell'>
          <FormattedNumber
            value={ balance
              ? balance / Math.pow(10, precision)
              : balance }
            minimumFractionDigits={ 0 }
            maximumFractionDigits={ precision }
          />
        </div>
        <div className='tableCell text_r'>
          {utils.format_number(utils.get_asset_amount(earned / secondsPerDay, cvbAsset), 0)}
        </div>
        <div className='tableCell text_r'>
          {utils.format_number(
            utils.get_asset_amount(vb.balance.amount * vestingPeriod / secondsPerDay, cvbAsset), 0
          )}
        </div>
        <div className='tableCell text_r'>
          {utils.format_number(vestingPeriod * (1 - availablePercent) / secondsPerDay, 2)}
        </div>
        <div className='tableCell'>
          <span className='mark3'>
            {
              availablePercent
                ? <FormattedNumber
                  value={ availablePercent * vb.balance.amount
                    ? availablePercent * vb.balance.amount / Math.pow(10, precision)
                    : availablePercent * vb.balance.amount }
                  minimumFractionDigits={ 0 }
                  maximumFractionDigits={ precision }
                />
                : 0
            }
          </span>

          <span>
            ({availablePercent > 0
              ? utils.format_number(availablePercent * 100, 2)
              : 0}%)
          </span>
        </div>
        <div className='tableCell text_c'>
          <button
            className='btn btn-claim'
            type='button'
            onClick={ this.handleClaimClick.bind(this) }>
            <Translate content='vesting_balances.claim'/>
          </button>
        </div>
      </div>
    );
  }
}

export default VestingBalance;