/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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
