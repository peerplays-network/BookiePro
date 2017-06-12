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
import {Link, IndexLink} from "react-router";
import counterpart from "counterpart";
import {connect} from 'react-redux';
import classNames from 'classnames';



import Notices from './Notices';
import AppActions from 'actions/AppActions';
import HelpActions from 'actions/HelpActions';
import Translate from "react-translate-component";

@connect(
	(state)=> {
		return {
			active: state.active,
			wallet: state.walletData.wallet,
			linkedAccounts: state.account.linkedAccounts,
			currentAccount: state.account.currentAccount,
			starredAccounts: state.account.starredAccounts,
			locked: state.wallet.locked,
			current_wallet: state.wallet.currentWallet
		};
	},
	{
		logout: AppActions.logout,
        toggleHelpModal: HelpActions.toggleHelpModal
	}
)
class Header extends React.Component {

	onLogoutClick(e) {
        e.preventDefault();

		this.props.logout();

	}

    onClickHelpLink(e) {
        this.props.toggleHelpModal(true);
        e.preventDefault();
	}

	render() {
		let {active} = this.props;
		let {linkedAccounts, currentAccount, starredAccounts} = this.props;
		let settings = counterpart.translate("header.settings");
		let help = counterpart.translate("header.help");


		return (
			<div className="header">
				<div className="box">{}
					<Link to="/dashboard" className="logo">
						<img src="images/logo_pp-2.png" alt=""/>
					</Link>

					<div className="nav__right nav-bdl">

						<Link to="/settings" className={classNames({"nav__link bb nav__link-set": true, "active": (/\/settings/.test(this.props.pathname))})}>
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-settings"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-settings-filled"></span>
								<span className="nav__linkText">{settings}</span>
							</span>
						</Link>

						<a onClick={this.onClickHelpLink.bind(this)} href="/help" className="nav__link bb nav__link-help">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-help"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-help-filled"></span>
								<span className="nav__linkText">{help}</span>
							</span>
						</a>

						<Notices />
						
						{/*<Link to="/explore" className="nav__link bb nav__link-expl" activeClassName="active">
			                <span className="nav__linkAlign">
			                    <span className="nav__linkIcon nav__linkIcon-blank icon-cube"/>
			                    <span className="nav__linkIcon nav__linkIcon-filled icon-cube-filled3"/>
			                    <span className="nav__linkText">Explore</span>
			                </span>
						</Link>
						<Link to="/settings" className="nav__link bb nav__link-set" activeClassName="active">
			                <span className="nav__linkAlign">
			                    <span className="nav__linkIcon nav__linkIcon-blank icon-settings"/>
			                    <span className="nav__linkIcon nav__linkIcon-filled icon-settings-filled"/>
			                    <span className="nav__linkText">Settings</span>
			                </span>
						</Link>
						<Link to="/help" className="nav__link bb nav__link-help" activeClassName="active">
			                <span className="nav__linkAlign">
			                    <span className="nav__linkIcon nav__linkIcon-blank icon-help"/>
			                    <span className="nav__linkIcon nav__linkIcon-filled icon-help-filled"/>
			                    <span className="nav__linkText">Help</span>
			                </span>
						</Link> */}
					</div>
					<nav className="nav">

						<Link to="/dashboard" className={classNames({"nav__link": true, "active": (/\/send|\/deposit-withdraw|\/account\/vesting/.test(this.props.pathname))})} activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-funds"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-funds-filled"></span>
								<Translate component="span" className="nav__linkText" content="header.dashboard" />
							</span>
						</Link>

						<Link to="/games" className={classNames({"nav__link": true, "active": (/\/games/.test(this.props.pathname))})} activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-star"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-star-filled"></span>
								<Translate component="span" className="nav__linkText" content="header.play" />
							</span>
						</Link>

						{/*<Link to="/exchange/PIXEL.BITCOIN_TESTPLAYS" className={classNames({"nav__link": true, "active": (/\/exchange/.test(this.props.pathname))})} activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-chart3"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-chart3-filled"></span>
						 		<Translate component="span" className="nav__linkText" content="header.exchange" />
							</span>
						</Link>*/}

						<Link to="/explore/voting" className="nav__link" activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-check2"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-check2-filled"></span>
								<Translate component="span" className="nav__linkText" content="header.vote" />
							</span>
						</Link>
						<Link to="/explore/blockchain" className="nav__link " activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-arrows2"></span>
								<span className="nav__linkIcon nav__linkIcon-filled icon-arrows2-filled"></span>
								<Translate component="span" className="nav__linkText" content="header.network" />
							</span>
						</Link>
						
						
						
						{/*<IndexLink to="/dashboard" className="nav__link bb" activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-funds"/>
								<span className="nav__linkIcon nav__linkIcon-filled icon-funds-filled"/>
								<span className="nav__linkText">My Funds </span>
							</span>
						</IndexLink>
						<Link to="/games" className="nav__link bb" activeClassName="active">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-star"/>
								<span className="nav__linkIcon nav__linkIcon-filled icon-star-filled"/>
								<span className="nav__linkText">Play Games </span>
							</span>
						</Link>
						<Link to="" className="nav__link bb">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-arrows2"/>
								<span className="nav__linkIcon nav__linkIcon-filled icon-arrows2-filled"/>
								<span className="nav__linkText">Betting Exchange </span>
							</span>
						</Link>
						<Link to="/referrals" className="nav__link bb">
							<span className="nav__linkAlign">
								<span className="nav__linkIcon nav__linkIcon-blank icon-rocket"/>
								<span className="nav__linkIcon nav__linkIcon-filled icon-rocket-filled"/>
								<span className="nav__linkText">Referrals </span>
							</span>
						</Link>*/}
					</nav>
					<nav className="nav__right">

					</nav>
				</div>
			</div>
		);
	}
}

export default Header;
