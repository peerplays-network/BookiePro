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

import AccountMemberService from "services/AccountMemberService";
import Translate from "react-translate-component";
import ReferralsPageActions from "actions/ReferralsPageActions";

@connect(
    (state)=> {
        return {
            account: state.dashboardPage.memberAccount
        }
    },
    {
        onClickUpgradeLifetime: ReferralsPageActions.onClickUpgradeLifetime
    }
)
class SideMember extends React.Component {

    navigateToVestingBalances() {
        this.props.navigateToVestingBalances();
    }
    onClickUpgradeLifetime() {
        this.props.onClickUpgradeLifetime();
    }
    render() {

        let account = this.props.account;

        if (!account) {
            return null;
        }

        let member_status = AccountMemberService.getAccountMemberStatus(this.props.account);

        let membership = "account.member." + member_status;

        return (
            <div className="aside__item">
                <div className="aside__title"><Translate content="account.member.rewards_club"/>:</div>
                <div className="aside__row">
                    <div className="aside__num"><Translate content={membership}/></div>
                </div>
                <div className="aside__btnWrap">
                    { member_status=== "lifetime" ?
                        null
                        :
                        <button className="btn aside__btn" onClick={this.onClickUpgradeLifetime.bind(this)}>
                            <span className="aside__btnIcon icon-rocket"></span>
                            <span className=""><Translate content="account.member.join_now"/></span>
                        </button>
                    }

                </div>
            </div>
        );
    }
}

export default SideMember;
