import React from 'react';
import {FormattedNumber} from 'react-intl';
import utils from 'common/utils';
import AssetName from './AssetName';

class FormattedPrice extends React.Component {
  render() {
    let {base_asset, quote_asset, base_amount, quote_amount} = this.props;
    let base_precision = utils.get_asset_precision(base_asset.precision);
    let quote_precision = utils.get_asset_precision(quote_asset.precision);
    let value = base_amount / base_precision / (quote_amount / quote_precision);

    if (isNaN(value) || !isFinite(value)) {
      return <span>n/a</span>;
    }

    let decimals = this.props.decimals
      ? this.props.decimals
      : base_asset.precision + quote_asset.precision;

    decimals = Math.min(8, decimals);

    return (
      <span>
        <FormattedNumber
          value={ value }
          minimumFractionDigits={ 2 }
          maximumFractionDigits={ decimals }/>
        <AssetName asset={ base_asset }/>/<AssetName asset={ quote_asset }/>
      </span>
    );
  }
}

export default FormattedPrice;