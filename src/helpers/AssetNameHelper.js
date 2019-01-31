class AssetNameHelper {

  static getAssetName(asset, replace = true) {
    let name = asset.symbol;
    let isBitAsset = asset.bitasset;
    let isPredMarket = isBitAsset && asset.bitasset.is_prediction_market;
    let {name: replacedName, prefix} = this.replaceName(
      name, isBitAsset && !isPredMarket && asset.issuer === '1.2.0'
    );

    if (replace && replacedName !== name) {
      return {
        prefix: prefix,
        name: replacedName
      };
    }

    return {
      prefix: prefix,
      name: name
    };
  }

  static replaceName(name, isBitAsset = false) {
    let toReplace = ['TRADE.', 'OPEN.', 'METAEX.'];
    let suffix = '';
    let i;

    for (i = 0; i < toReplace.length; i++) {
      if (name.indexOf(toReplace[i]) !== -1) {
        name = name.replace(toReplace[i], '') + suffix;
        break;
      }
    }

    return {
      name,
      prefix: isBitAsset ? 'bit' : toReplace[i] ? toReplace[i].toLowerCase() : ''
    };
  }
}

export default AssetNameHelper;