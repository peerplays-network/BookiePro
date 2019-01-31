import React from 'react';
import {FormattedNumber} from 'react-intl';
import utils from 'common/utils';
import assetUtils from 'common/asset_utils';
import {PropTypes} from 'react';
import Popover from 'react-popover';
import HelpContent from './HelpContent';
import AssetNameNew from './AssetNameNew';

/**
 *  Given an amount and an asset, render it with proper precision
 *
 *  Expected Properties:
 *     asset:  asset id, which will be fetched from the
 *     amount: the ammount of asset
 *
 */

class FormattedAssetNew extends React.Component {
    static propTypes = {
      amount: PropTypes.any.isRequired,
      asset: PropTypes.object,
      exact_amount: PropTypes.bool,
      decimalOffset: PropTypes.number,
      color: PropTypes.string,
      hide_asset: PropTypes.bool,
      hide_amount: PropTypes.bool,
      asPercentage: PropTypes.bool,
      assetInfo: PropTypes.node
    };

    static defaultProps = {
      amount: 0,
      decimalOffset: 0,
      hide_asset: false,
      hide_amount: false,
      asPercentage: false,
      assetInfo: null
    };

    static contextTypes = {
      history: React.PropTypes.object
    };

    constructor(props) {
      super(props);
      this.state = {isPopoverOpen: false};
      this.togglePopover = this.togglePopover.bind(this);
      this.closePopover = this.closePopover.bind(this);
    }

    togglePopover(e) {
      e.preventDefault();
      this.setState({isPopoverOpen: !this.state.isPopoverOpen});
    }

    closePopover() {
      this.setState({isPopoverOpen: false});
    }

    render() {
      let {
        amount,
        decimalOffset,
        color,
        asset,
        issuer,
        hide_asset,
        hide_amount,
        asPercentage
      } = this.props;
      let assetImm = asset;

      if (asset && asset.toJS) {
        asset = asset.toJS();
      }

      let colorClass = color ? 'facolor-' + color : '';
      let precision = utils.get_asset_precision(asset.precision);
      let decimals = Math.max(0, asset.precision - decimalOffset);

      if (hide_amount) {
        colorClass += ' no-amount';
      }

      if (asPercentage) {
        let supply = parseInt(asset.dynamic.current_supply, 10);
        let percent = utils.format_number((amount / supply) * 100, 4);
        return (
          <span className={ colorClass }>
            {percent}%
          </span>
        );
      }

      let issuerName = (issuer && issuer.get('name')) ? issuer.get('name') : '';
      let description = assetUtils.parseDescription(asset.options.description);

      const currency_popover_body = !hide_asset && this.props.assetInfo && (
        <div>
          <HelpContent
            path={ 'assets/Asset' }
            section='summary'
            symbol={ asset.symbol }
            description={ description.short_name ? description.short_name : description.main }
            issuer={ issuerName }
          />
          {this.props.assetInfo}
        </div>
      );

      return (
        <span className={ colorClass } >
          {
            !hide_amount
              ? <FormattedNumber
                value={ this.props.exact_amount ? amount : amount / precision }
                minimumFractionDigits={ 0 }
                maximumFractionDigits={ decimals }
              />
              : null
          }
          {
            !hide_asset && (this.props.assetInfo
              ? (
                <span>&nbsp;
                  <Popover
                    isOpen={ this.state.isPopoverOpen }
                    onOuterAction={ this.closePopover }
                    body={ currency_popover_body }
                  >
                    <span className='currency click-for-help' onClick={ this.togglePopover }>
                      <AssetNameNew asset={ assetImm } name={ asset.symbol } />
                    </span>
                  </Popover>
                </span>
              )
              : <span className='currency' onClick={ this.togglePopover }>
                <AssetNameNew asset={ assetImm } name={ asset.symbol } />
              </span>
            )
          }
        </span>
      );
    }
}

export default FormattedAssetNew;

