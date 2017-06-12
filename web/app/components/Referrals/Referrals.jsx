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
import Translate from "react-translate-component";
import {connect} from "react-redux";
import ReferralsPageActions from "actions/ReferralsPageActions";
import AccountMemberService from "services/AccountMemberService";

const mapStateToProps = (state) => {
    return {
        account: state.referralsPageReducer.account,

    };
};

@connect(
    mapStateToProps,
    {
        onClickUpgradeLifetime: ReferralsPageActions.onClickUpgradeLifetime,
        setPageData: ReferralsPageActions.setPageData,
        subscribe: ReferralsPageActions.subscribe,
        unSubscribe: ReferralsPageActions.unSubscribe
    }
)
class Referrals extends React.Component {

    componentWillMount() {
        this.props.setPageData();
        this.props.subscribe();
    }
    componentWillUnmount() {
        this.props.unSubscribe();
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

        let expiration = null;

        if( member_status === "annual" ) {
            expiration = (<span>(<Translate content="account.member.expires"/> {account.get('membership_expiration_date')})</span>)
        }

        let expiration_date = account.get('membership_expiration_date');

        if( expiration_date === "1969-12-31T23:59:59" ) {
            expiration_date = "Never"
        } else if( expiration_date === "1970-01-01T00:00:00" ) {
            expiration_date = "N/A"
        }

        return (
            <div className="main">
                <section className="content">
                    <div className="box">

                        <h1 className="content__headTitle"><Translate content="account.member.referrals"/></h1>

                        <h3><Translate content={membership}/> {expiration}</h3>

                        <div>
                            <Translate content="account.member.membership_expiration"/>: {expiration_date}
                        </div>

                        { member_status=== "lifetime" ?
                            <button  type="button" className="btn btn-content__head" disabled={true}>
                                <span className="content__headBtnIcon icon-arrows3"/>
                                <span className=""><Translate content="account.member.upgrade_lifetime"/></span>
                            </button>

                            : (

                                <button  type="button" className="btn btn-content__head" onClick={this.onClickUpgradeLifetime.bind(this)}>
                                    <span className="content__headBtnIcon icon-arrows3"/>
                                    <span className=""><Translate content="account.member.upgrade_lifetime"/></span>
                                </button>

                            )}



                        <div className="h100"></div>
                    </div>
                </section>
            </div>
        )
    }
}


export default Referrals;