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

import React from "react";
import utils from "common/utils";
import asset_utils from "common/asset_utils";
import ChainTypes from "./ChainTypes";
import BindToChainState from "./BindToChainState";

@BindToChainState()
class AssetName extends React.Component {

	static propTypes = {
		asset: ChainTypes.ChainAsset.isRequired,
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

		let isBitAsset = asset.has("bitasset");
		let isPredMarket = isBitAsset && asset.getIn(["bitasset", "is_prediction_market"]);

		let {name: replacedName, prefix} = utils.replaceName(name, isBitAsset && !isPredMarket && asset.get("issuer") === "1.2.0");
		// let prefix = isBitAsset && !isPredMarket ? <span>bit</span> :
		// 			 replacedName !== this.props.name ? <span>{replacedPrefix}</span> : null;

		if (replace && replacedName !== this.props.name) {
			let desc = asset_utils.parseDescription(asset.getIn(["options", "description"]));
			let tooltip = `<div><strong>${this.props.name}</strong><br />${desc.short ? desc.short : desc.main}</div>`;
			return (
				<span
					className="tooltip"
					data-tip={tooltip}
					data-place="bottom"
					data-type="light"
					data-html={true}
				>
					<span className="asset-prefix-replaced">{prefix}</span><span>{replacedName}</span>
				</span>
			);
		} else {
			return <span>{prefix}<span>{name}</span></span>
		}

	}
}

export default class AssetNameWrapper extends React.Component {

	render() {
		return (
			<AssetName {...this.props} asset={this.props.name} />
		);
	}
}
