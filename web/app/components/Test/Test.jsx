import React from "react";
import {connect} from "react-redux";
import Translate from "react-translate-component";
import InnerTest from "./InnerTest"
import AccountVestingPageActions from "actions/AccountVestingPageActions";
import asset_utils from "common/asset_utils";
import {connectComponentWrapper} from "../Wrappers/ConnectComponentWrapper";


@connect(
    (state) => {
        return {
            balances: state.accountVestingPageReducer.balances
        };
    },
    {
        fetchData: AccountVestingPageActions.fetchData,
        claimVestingBalance: AccountVestingPageActions.claimVestingBalance
    }
)
class Test extends React.Component {

    componentWillMount() {



    }

    render() {

        console.log('TEST', connectComponentWrapper(InnerTest));

        let Comp = connectComponentWrapper(InnerTest, (state) => {
                return {
                    accountId: state.app.accountId
                };
            },
            {

            });

        return (
            <div className="main">
                <Comp testVar="1" asset="1.3.0"/>
            </div>
        )
    }
}


export default Test;