import React from 'react';
import utils from 'common/utils';

class AssetName extends React.Component {

  static propTypes = {
    replace: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    replace: true
  };

  shouldComponentUpdate(nextProps) {
    return (nextProps.replace !== this.props.replace || nextProps.name !== this.props.replace);
  }

  render() {
    let {replace, asset} = this.props;

    if (!asset) {
      return null;
    }

    let name = asset.symbol || asset.name;
    let isBitAsset = asset.bitasset;
    let isPredMarket = isBitAsset && asset.bitasset.is_prediction_market;

    let {name: replacedName, prefix} = utils.replaceName(
      name,
      isBitAsset && !isPredMarket && asset.issuer === '1.2.0'
    );

    if (replace && replacedName !== this.props.name) {
      return (
        <span>
          <span>{prefix}</span>
          <span>{replacedName}</span>
        </span>
      );
    } else {
      return (
        <span>{prefix}
          <span>{name}</span>
        </span>
      );
    }
  }
}

export default AssetName;
