import React from 'react';
import {FormattedNumber} from 'react-intl';
import utils from 'common/utils';

import AssetName from './AssetName';

class FormattedAmount extends React.Component {
  static defaultProps = {
    decimalOffset: 0
  };
  render() {
    let {asset, amount, decimalOffset} = this.props;
    let precision = utils.get_asset_precision(asset.precision);
    let decimals = Math.max(0, asset.precision - decimalOffset);
    let value = amount / precision;

    if (isNaN(value) || !isFinite(value)) {
      return <span>n/a</span>;
    }

    return (
      <span>
        <FormattedNumber
          value={ value }
          minimumFractionDigits={ 2 }
          maximumFractionDigits={ decimals }/>
        <AssetName asset={ asset }/>
      </span>
    );
  }
}

export default FormattedAmount;