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
import Translate from "react-translate-component";
import moment from "moment-timezone";

import asset_utils from "common/asset_utils";

import {FormattedNumber} from "react-intl";

import TournamentStartTime from "./TournamentStartTime"
import JoinTournamentButton from "./JoinTournamentButton"

import {setWalletPosition} from 'actions/RWalletUnlockActions';

import RockPaperScissorsActions from "actions/Games/RockPaperScissors/RockPaperScissorsActions";
import RockPaperScissorsNavigateActions from "actions/Games/RockPaperScissors/RockPaperScissorsNavigateActions";

let callback = {
    exists: false,
    run: null
};


class Dashboard extends React.Component {


    componentWillUpdate(nextProps) {
        const {walletLocked} = this.props;

        if(!nextProps.walletLocked && nextProps.walletLocked != walletLocked) {
            if(callback.exists && callback.run) {
                callback.exists = false;
                callback.run(nextProps.walletLocked);
                callback.run = null;
            }
        }
    }

    componentWillMount() {

        this.props.subscribe('dashboard');
        this.props.fetchDashboardTournaments();

    }

    componentWillUnmount() {
        this.props.unSubscribe('dashboard');
    }

    joinToTournament(tournamentId) {

        let {walletLocked, isOpen} = this.props;

        if(walletLocked && !isOpen) {
            callback.exists = true;
            callback.run = this.props.joinToTournament.bind(this, tournamentId);
            this.props.setWalletPosition(true);
            return;
        }

        this.props.joinToTournament(tournamentId);

    }

    play(tournamentId) {
        console.log('navigateToGame', tournamentId);
        this.props.navigateToGame(tournamentId)
    }

    render() {

        let {dashboardList, accountId} = this.props;

        let list = dashboardList.map((tournamentImm) => {

            let item = tournamentImm.toJS(),
                amount = tournamentImm.getIn(["options", "buy_in", "amount"]),
                prize = tournamentImm.get('prize_pool'),
                precision = tournamentImm.getIn(["options", "buy_in", "asset", "precision"]);

           return  (
               <div key={item.id} className="tableRow">
                   <div className="tableCell">#RPS {item.id}</div>
                   <div className="tableCell">RPS</div>
                   <div className="tableCell">
                       <Translate content="games.rps_game.upcoming_players_text"
                           current={tournamentImm.get("registered_players") }
                           total={tournamentImm.getIn(["options", "number_of_players"]) } />
                   </div>

                   <div className="tableCell ">
                        {moment.utc(tournamentImm.getIn(["options", "registration_deadline"])).tz(moment.tz.guess()).format("MMMM D, YYYY hh:mm A Z")}
                   </div>

                   <div className="tableCell ">

                       <TournamentStartTime start_delay={tournamentImm.getIn(["options", "start_delay"])} start_time={tournamentImm.getIn(["options", "start_time"])} />

                   </div>
                   <div className="tableCell ">

                       <FormattedNumber
                           value={amount && precision ? amount / Math.pow(10, precision) : 0}
                           minimumFractionDigits={0}
                           maximumFractionDigits={precision}
                       />

                       <span> {asset_utils.getSymbol(tournamentImm.getIn(["options", "buy_in", "asset", "symbol"]))} </span>


                   </div>
                   <div className="tableCell ">
                       <FormattedNumber
                           value={prize && precision ? prize / Math.pow(10, precision) : 0}
                           minimumFractionDigits={0}
                           maximumFractionDigits={precision}
                       />
                       <span> {asset_utils.getSymbol(tournamentImm.getIn(["options", "buy_in", "asset", "symbol"]))} </span>
                   </div>
                   <div className="tableCell text_r">

                        {accountId ? <JoinTournamentButton play={this.play.bind(this)} tournament={tournamentImm} joinToTournament={this.joinToTournament.bind(this)} tournamentId={tournamentImm.get('id')} accountId={accountId} number_of_players={tournamentImm.getIn(["options", "number_of_players"])} whitelist={tournamentImm.getIn(["options","whitelist"])} /> : null}

                   </div>
               </div>
           )
        });

        return (
            <div id="dashboard" className="tab__deploy" style={{display: 'block'}}>
                <div className="box-inner box-inner-2">
                    <div className="table__section">
                        <Translate component="div" className="table2__title" content="games.rps_game.my_scheduled_tournaments" />
                        <div className="table table2 table-pg-db1">
                            <div className="table__head tableRow">
                                <Translate component="div" className="tableCell" content="games.rps_game.rps_game_id" />
                                <Translate component="div" className="tableCell" content="games.rps_game.game" />
                                <Translate component="div" className="tableCell" content="games.rps_game.players_registered" />
                                <Translate component="div" className="tableCell" content="games.rps_game.registration_deadline" />
                                <Translate component="div" className="tableCell" content="games.rps_game.start_time" />
                                <Translate component="div" className="tableCell" content="games.rps_game.buy_in" />
                                <Translate component="div" className="tableCell" content="games.rps_game.jackpot" />
                                <div className="tableCell text_r">
                                    <Translate component="div" className="table__thAction" content="games.rps_game.actions" />
                                </div>
                            </div>
                            <div className="table__body">

                                {list}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard = connect(
    (state) => {
        return {
            accountId: state.app.accountId,
            dashboardList: state.rockPaperScissorsReducer.dashboardList,
            walletLocked: state.wallet.locked,
            walletIsOpen: state.wallet.isOpen
        };
    },
    {
        joinToTournament: RockPaperScissorsActions.joinToTournament,
        subscribe: RockPaperScissorsActions.subscribe,
        unSubscribe: RockPaperScissorsActions.unSubscribe,
        fetchDashboardTournaments: RockPaperScissorsActions.fetchDashboardTournaments,
        navigateToDashboardTournaments: RockPaperScissorsNavigateActions.navigateToDashboardTournaments,

        navigateToGame: RockPaperScissorsNavigateActions.navigateToGame,
        setWalletPosition: setWalletPosition
    }
)(Dashboard);

export default Dashboard;