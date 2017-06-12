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
import {connect} from 'react-redux';
import classNames from "classnames";
import utils from "common/utils";
import AssetNameHelper from "helpers/AssetNameHelper";
import ExchangePageActions from "actions/ExchangePageActions";
import NavigateActions from "actions/NavigateActions";
import Translate from "react-translate-component";
import AssetName from "../Explorer/BlockChain/AssetName";
import asset_utils from "common/asset_utils";

class ExchangeMarketsTabs extends React.Component {

	constructor() {

		super();
		this.state = {
			searchMarket: ''
		};

        this.inited = false;
	}

    componentWillReceiveProps(nextProps) {

		if (!this.inited && nextProps.baseAssetSymbol) {

			this.inited = true;

			nextProps.tabs.find((tab, idx) => {

            	if (nextProps.baseAssetSymbol === tab.name) {

            		if (nextProps.currentTab !== idx) {
                        this.props.setMarketTab(idx);
					}

				}

			});

		}
	}

	_onSearchChange(e) {

		this.setState({
			searchMarket: e.target.value
		});

	}

	onSetMarketTab(nextTab, e) {

		if(this.props.currentTab !== nextTab) {
			this.props.setMarketTab(nextTab);
		}

		e.preventDefault();

	}

	onChangeSort(type) {
		this.props.changeExchangeMarketsRowsSort(type);
	}

	onNavigateTo(id) {
		this.props.navigateToExchangeMarket(id);
	}

	render() {

		let {searchMarket} = this.state,
			{tabs, currentTab, marketRowsData, marketRowsDataSortBy, marketRowsDataSortInvert, marketRowsDataLoaderIsShow} = this.props,
            marketsRows = null,
			tabsRows = tabs.map((tab, idx) => {

				return (
					<div key={tab.prefix + tab.name} className="table__tabItem">
						<a href="" onClick={this.onSetMarketTab.bind(this, idx)} className={classNames("table__tabLink", {"active": currentTab === idx})}><AssetName asset={tab} /></a>
					</div>
				);
			});


		if(!marketRowsDataLoaderIsShow) {
			marketRowsData = marketRowsData.sort((a, b) => {
				switch(marketRowsDataSortBy) {
					case "volume":
						if(marketRowsDataSortInvert) {
							return b.volumeBase - a.volumeBase;
						} else {
							return a.volumeBase - b.volumeBase;
						}
					case "change":
						if(marketRowsDataSortInvert) {
							return b.change - a.change;
						} else {
							return a.change - b.change;
						}
					case "price":
						if(marketRowsDataSortInvert) {
							return b.price - a.price;
						} else {
							return a.price - b.price;
						}
					case "name":
						let aName = (a.assetName.prefix + a.assetName.name).toLowerCase(),
							bName = (b.assetName.prefix + b.assetName.name).toLowerCase();

						if(aName > bName) {
							return marketRowsDataSortInvert ? -1 : 1;
						} else if(aName < bName) {
							return marketRowsDataSortInvert ? 1 : -1;
						} else {
							return 0;
						}

				}
			});

			marketsRows = marketRowsData
				.filter((row)=> {
					return searchMarket == "" || (asset_utils.getSymbol(row.assetName.name).toLowerCase()).indexOf(searchMarket.toLowerCase()) != -1
				})
				.map((row) => {
					return (
						<div key={row.id} className="tableRow" onClick={this.onNavigateTo.bind(this, row.id)}>
							<div className="tableCell">
								<span className="ex_tablePic__wrap"><img src="images/star.png" className="ex_tablePic" alt=""/></span>
								<b className=""><AssetName asset={row.assetName} /></b>
							</div>
							<div className="tableCell text_r">{utils.format_volume(row.volumeBase)}</div>
							<div className="tableCell text_r">{row.priceText}</div>
							<div className="tableCell text_r">{row.change}%</div>
						</div>
					);
				});
		}


		return (
			<div className="ex-markets">
				<section className="section">
					<div className="section__title">
						<div className="section__titleText"><Translate content="markets.title"/></div>
						<div className="section__titleSearch">
							<input type="text" autoComplete="off" placeholder="Search" value={searchMarket} onChange={this._onSearchChange.bind(this)} className="field-type4"/>
						</div>
					</div>
					<div className="section__table">
						<div className="table table3 table-sm">
							<div className="table__tab">
								{tabsRows}
							</div>
							<div className="table__head tableRow">
								<div className="tableCell pointer " onClick={this.onChangeSort.bind(this, "name")}>MARKETS</div>
								<div className="tableCell text_r pointer" onClick={this.onChangeSort.bind(this, "volume")}>
									VOLUME
								</div>
								<div className="tableCell text_r pointer" onClick={this.onChangeSort.bind(this, "price")}>
									PRICE
								</div>
								<div className="tableCell text_r pointer" onClick={this.onChangeSort.bind(this, "change")}>
									CHANGE
								</div>
							</div>
							<div className="table__body">
								{(marketRowsDataLoaderIsShow) ?

									<div className="loader-splash">
										<span className="loader loader-s"/>
									</div>
									:
									marketsRows
								}

							</div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}

ExchangeMarketsTabs = connect(
	(state) => {
		return {
            baseAssetSymbol: state.exchangePageReducer.baseAssetSymbol,
			currentTab: state.exchangePageReducer.currentTab,
			tabs: state.exchangePageReducer.tabs,
			marketRowsData: state.exchangePageReducer.marketRowsData,
			marketRowsDataSortBy: state.exchangePageReducer.marketRowsDataSortBy,
			marketRowsDataSortInvert: state.exchangePageReducer.marketRowsDataSortInvert,
			marketRowsDataLoaderIsShow: state.exchangePageReducer.marketRowsDataLoaderIsShow
		};
	},
	{
		setMarketTab: ExchangePageActions.setMarketTab,
		changeExchangeMarketsRowsSort: ExchangePageActions.changeExchangeMarketsRowsSort,
		navigateToExchangeMarket: NavigateActions.navigateToExchangeMarket
	}
)(ExchangeMarketsTabs);

export default ExchangeMarketsTabs;