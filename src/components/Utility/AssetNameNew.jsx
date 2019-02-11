//unused
import React from 'react';
import utils from 'common/utils';
import asset_utils from 'common/asset_utils';

class AssetNameNew extends React.Component {
  static propTypes = {
    asset: React.PropTypes.object,
    replace: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    replace: true
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.replace !== this.props.replace ||
      nextProps.name !== this.props.replace
    );
  }

  render() {
    let {name, replace, asset} = this.props;
    let isBitAsset = asset.has('bitasset');
    let isPredMarket = isBitAsset && asset.getIn(['bitasset', 'is_prediction_market']);
    let {name: replacedName, prefix} = utils.replaceName(
      name, isBitAsset && !isPredMarket && asset.get('issuer') === '1.2.0'
    );

    if (replace && replacedName !== this.props.name) {
      let desc = asset_utils.parseDescription(asset.getIn(['options', 'description']));
      let tooltip = `<div><strong>${this.props.name}</strong><br />${desc.short ? desc.short : desc.main}</div>`; // eslint-disable-line
      return (
        <span
          className='tooltip'
          data-tip={ tooltip }
          data-place='bottom'
          data-type='light'
          data-html={ true }
        >
          <span className='asset-prefix-replaced'>{prefix}</span><span>{replacedName}</span>
        </span>
      );
    } else {
      return <span>{prefix}<span>{name}</span></span>;
    }
  }
}

export default AssetNameNew;
