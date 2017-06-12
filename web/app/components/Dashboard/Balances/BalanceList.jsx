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
import BalanceRow from "./BalanceRow";
import BalanceEmptyRow from "./BalanceEmptyRow";
import Translate from "react-translate-component";

class BalanceList extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let {title, list, precision, decimals, showHiddenAssets} = this.props;

		let renderList,
			showList = false;

		renderList = list.map((immItem) => {
			let data = immItem.toJS();

			if(!showHiddenAssets && data.hidden) {
				return null;
			} else {
				showList = true;
			}

			return (
				<BalanceRow showHideOption={this.props.showHideOption} onNavigateToDeposit={this.props.onNavigateToDeposit} onNavigateToSend={this.props.onNavigateToSend} onAfterChangeHide={this.props.onAfterChangeHide} onAfterChangeShow={this.props.onAfterChangeShow} key={data.id} precision={precision} decimals={decimals} data={data}/>
			);

		});

		if(!showList) {
			renderList = <BalanceEmptyRow />;
		}

		return (
			<div className="table__wrap">
				<div className="table__title">{title}</div>
				<table className="table">
					<thead>
					<tr className="tr tr-head">
						<th className="th th__assetsSym">
							<div className="th__in"><Translate content="dashboard.assetSymbol" /></div>
						</th>
						<th className="th th__assetsName">
							<div className="th__in"><Translate content="dashboard.assetName" /></div>
						</th>
						<th className="th">
							<div className="th__in"><Translate content="dashboard.availableBalance" /></div>
						</th>
						{/*<th className="th">*/}
							{/*<div className="th__in"><Translate content="dashboard.openOrders" /></div>*/}
						{/*</th>*/}
						<th className="th">
							<div className="th__in"><Translate content="dashboard.totalBalance" /></div>
						</th>
						{/*<th className="th">*/}
							{/*<div className="th__in"><Translate content="dashboard.totalValue" unit={asset_utils.getSymbol(unit)} /></div>*/}
						{/*</th>*/}
						<th className="th th__action">
							<div className="th__in"><Translate content="dashboard.actions" /></div>
						</th>
					</tr>
					</thead>
					<tbody className="tr tr-main">
					{renderList}
					</tbody>
				</table>
			</div>
		);
	}

}

export default BalanceList;