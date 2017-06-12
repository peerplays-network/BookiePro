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
import {Link} from "react-router";
import {FormattedNumber} from "react-intl";
import classNames from "classnames";
import Translate from "react-translate-component";
import asset_utils from "common/asset_utils";

class BalanceRow extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			popup: false
		};
		this._closePopup = this._closePopup.bind(this);
		this.changeVisible = this.changeVisible.bind(this);
	}

	componentDidMount() {
		document.addEventListener('click', this._closePopup, false);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this._closePopup, false);
	}

	_closePopup() {
		if(this.state.popup) {
			this.setState({
				popup: false
			});
		}
	}

	_togglePopup(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();

		this.setState({
			popup: !this.state.popup
		});
	}

	_show() {
		if(this.props.onAfterChangeShow) {
			this.props.onAfterChangeShow(this.props.data.id);
		}
	}

	_hide() {
		if(this.props.onAfterChangeHide) {
			this.props.onAfterChangeHide(this.props.data.id);
		}
	}

	changeVisible(e) {
		e.preventDefault();
		if(this.props.data.hidden)
			this._show();
		else
			this._hide();
	}

	onMenuSend(symbol) {
        if (this.props.onNavigateToSend) {
            this.props.onNavigateToSend(symbol);
        }
	}

    onMenuDepositWithDraw(symbol) {
        if (this.props.onNavigateToDeposit) {
            this.props.onNavigateToDeposit(symbol);
        }
	}

	render() {
		let {precision, decimals, data} = this.props;

		let showPopup = this.state.popup;
//TODO::  config f PIXEL.BITCOIN
		let marketLink = (data.symbol == 'PIXEL.BITCOIN') ? (data.symbol + '_' + CORE_ASSET) : ('PIXEL.BITCOIN_' + data.symbol);

		return (
			<tr key={data.id} className={classNames('tr', { 'tr-hidden active': data.hidden, 'tr-main' : !data.hidden })}>
				<td className="td td__assetsSym">
					<div className="td__in">{asset_utils.getSymbol(data.symbol)}</div>
				</td>
				<td className="td td__assetsName">
					<div className="td__in">{data.name}</div>
				</td>
				<td className="td">
					<div className="td__in">
						<FormattedNumber
							value={data.available / data.precision}
							minimumFractionDigits={0}
							maximumFractionDigits={data.decimals}
						/>
					</div>
				</td>
				{/*<td className="td">*/}
					{/*<div className="td__in">*/}
						{/*{data.orders === 0 ? 'N/A' :*/}
							{/*<FormattedNumber*/}
								{/*value={data.orders / data.precision}*/}
								{/*minimumFractionDigits={0}*/}
								{/*maximumFractionDigits={data.decimals}*/}
							{/*/>*/}
						{/*}*/}
					{/*</div>*/}
				{/*</td>*/}
				<td className="td">
					<div className="td__in">
						<FormattedNumber
							value={data.totalBalance / data.precision}
							minimumFractionDigits={0}
							maximumFractionDigits={data.decimals}
						/>
					</div>
				</td>
				{/*<td className="td">*/}
					{/*<div className="td__in">*/}
						{/*{(!data.totalValue || isNaN(data.totalValue / precision)) ? 'N/A' :*/}
							{/*<FormattedNumber*/}
								{/*value={data.totalValue / precision}*/}
								{/*minimumFractionDigits={0}*/}
								{/*maximumFractionDigits={this.props.currentDecimals}*/}
							{/*/>*/}
						{/*}*/}
					{/*</div>*/}
				{/*</td>*/}
				<td className="td td__action">
					<div className="td__in">
						<div className={classNames('tableAction__dd', 'dd', {'open' : showPopup })}>
							<a className="tableAction tableAction__trigger ddTrigger" onClick={this._togglePopup.bind(this)}>
								<span className="tableAction__text ddTrigger__text"><Translate content="dashboard.actions" /></span>
								<span className="tableAction__icon icon-str_close"/>
								<span className="tableAction__icon icon-str_open"/>
							</a>
							<div className="tableAction__ddMenu ddMenu">
								<ul className="ddMenu__list">
									{/*<li className="ddMenu__item" onClick={this.onMenuDepositWithDraw.bind(this, data.symbol)}>*/}
										{/*<Link to="" className="ddMenu__link active">*/}
											{/*<span className="ddMenu__icon icon-arrows3"/>*/}
											{/*<Translate content="dashboard.balances_row_menu.deposit_withdraw" />*/}
										{/*</Link>*/}
									{/*</li>*/}
									<li className="ddMenu__item">
										<Link className="ddMenu__link active" onClick={this.onMenuSend.bind(this, data.symbol)}>
											<span className="ddMenu__icon icon-arrow2"/>
											<Translate content="dashboard.balances_row_menu.send" />
										</Link>
									</li>
									{/*<li className="ddMenu__item">
										<Link to={"/exchange/" + marketLink} className="ddMenu__link active">
											<span className="ddMenu__icon chart icon-chart2"/>
											<Translate content="dashboard.balances_row_menu.markets" />
										</Link>
									</li>*/}

									{(this.props.showHideOption ?

										<li className="ddMenu__item">
											<a href="" className="ddMenu__link active" onClick={this.changeVisible}>
												<span className="ddMenu__icon close icon-close2"/>
												<span className="">{data.hidden ?
													<Translate content="dashboard.balances_row_menu.show_asset"/> :
													<Translate content="dashboard.balances_row_menu.hide_asset"/>}</span>
											</a>
										</li>

									: null)}

									<div className="tableAction__ddMenu ddMenu">
										<ul className="ddMenu__list">

										</ul>
									</div>
								</ul>
							</div>
						</div>
					</div>
				</td>
			</tr>
		);
	}

}

export default BalanceRow;
