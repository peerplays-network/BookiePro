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

import asset_utils from "common/asset_utils";
import {FormattedNumber} from "react-intl";
import Translate from "react-translate-component";
import moment from "moment-timezone";

import TournamentStartTime from "./TournamentStartTime"
import JoinTournamentButton from "./JoinTournamentButton"
import Pagination from "./Pagination"

//import TabFilter from "./TabFilter";
import DropDownTrigger from "./DropDownTrigger";

import {setWalletPosition} from 'actions/RWalletUnlockActions';
import RockPaperScissorsActions from "actions/Games/RockPaperScissors/RockPaperScissorsActions";
import RockPaperScissorsNavigateActions from "actions/Games/RockPaperScissors/RockPaperScissorsNavigateActions";



let callback = {
    exists: false,
    run: null
};



class Explore extends React.Component {

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


    componentWillReceiveProps(nextProps) {

        if (this.props.page !== nextProps.page) {
            this.props.fetchExploreTournaments(nextProps.page);
        }
    }
    componentWillMount() {
        this.props.subscribe('explore');
        this.props.fetchExploreTournaments(this.props.page);
    }

    componentWillUnmount() {
        this.props.unSubscribe('explore');
    }


    setAssetSymbol(unitId) {

        setTimeout(() => {
            this.props.setExploreDDCurrent(unitId);
        }, 0);
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

        this.props.navigateToGame(tournamentId);

    }

    sortBy(field) {

        setTimeout(() => {
            this.props.setSortExploreBy(field);
        }, 0)

    }
    navigateTo(page) {

        this.props.navigateToAllTournaments(page);

    }

    render() {

        let {exploreList, accountId, exploreDropDownItems, explorePage, exploreCountPages} = this.props;

        // let numPlayersObject = Object.create(null);

        // exploreList.forEach((tournamentImm) => {
        //
        //     let amount = tournamentImm.getIn(["options", "buy_in", "amount"]),
        //         prize = tournamentImm.get('prize_pool'),
        //         precision = tournamentImm.getIn(["options", "buy_in", "asset", "precision"]),
        //         numberOfPlayers = tournamentImm.getIn(["options", "number_of_players"]);
        //
        //
        //     if (!numPlayersObject[numberOfPlayers]) {
        //         numPlayersObject[numberOfPlayers] = [];
        //     }
        //
        //     numPlayersObject[numberOfPlayers].push(
        //         (
        //             <div key={tournamentImm.get('id')} className="tableRow">
        //                 <div className="tableCell">#RPS {tournamentImm.get('id')}</div>
        //                 <div className="tableCell">{tournamentImm.get('creator_account_name')}</div>
        //                 <div className="tableCell ">
        //
        //                      {moment.utc(tournamentImm.getIn(["options", "registration_deadline"])).tz(moment.tz.guess()).format("MMMM D, YYYY hh:mm A Z")}
        //
        //                 </div>
        //                 <div className="tableCell ">
        //
        //                     <TournamentStartTime start_delay={tournamentImm.getIn(["options", "start_delay"])} start_time={tournamentImm.getIn(["options", "start_time"])} start_time_tournament={tournamentImm.getIn(["start_time"])} />
        //
        //                 </div>
        //                 <div className="tableCell ">
        //
        //                     <FormattedNumber
        //                         value={amount && precision ? amount / Math.pow(10, precision) : 0}
        //                         minimumFractionDigits={0}
        //                         maximumFractionDigits={precision}
        //                     />
        //
        //                     <span> {asset_utils.getSymbol(tournamentImm.getIn(["options", "buy_in", "asset", "symbol"]))} </span>
        //
        //
        //                 </div>
        //                 <div className="tableCell ">
        //                     <FormattedNumber
        //                         value={prize && precision ? prize / Math.pow(10, precision) : 0}
        //                         minimumFractionDigits={0}
        //                         maximumFractionDigits={precision}
        //                     />
        //                     <span> {asset_utils.getSymbol(tournamentImm.getIn(["options", "buy_in", "asset", "symbol"]))} </span>
        //                 </div>
        //                 <div className="tableCell">
        //                     <Translate content="explorer.play.lists.upcoming_players_text"
        //                         current={tournamentImm.get("registered_players") }
        //                         total={tournamentImm.getIn(["options", "number_of_players"]) } />
        //                 </div>
        //
        //
        //                 <div className="tableCell text_r">
        //
        //                     {accountId ? <JoinTournamentButton play={this.play.bind(this)} tournament={tournamentImm} joinToTournament={this.joinToTournament.bind(this)} accountId={accountId} /> : null}
        //
        //                 </div>
        //
        //             </div>
        //         )
        //     );
        //
        //
        // });


        // let numKeys = Object.keys(numPlayersObject);
        //
        // let list = numKeys.map((numberOfPlayers) => {
        //
        //     return (
        //         <div key={numberOfPlayers} className="table__section">
        //             <div className="table2__title">{numberOfPlayers} players</div>
        //             <div className="table table2 table-pg-explore">
        //                 <div className="table__head tableRow">
        //
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'id')}>ID #</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'creator_account_name')}>Tournament Creator</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'registration_deadline')}>Registration Deadline</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'start_time')}>Start Time</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'buy_in')}>Buy - in</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'prize')}>Jackpot</div>
        //                     <div className="tableCell pointer" onClick={this.sortBy.bind(this, 'registered_players')}>Players Currently Registered</div>
        //
        //                     <div className="tableCell pointer text_r" onClick={this.sortBy.bind(this, 'open')}><div className="table__thAction">Open</div></div>
        //                 </div>
        //                 <div className="table__body">
        //
        //                     {numPlayersObject[numberOfPlayers]}
        //
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // });

        return (
            <div>
                <div id="explore" className="tab__deploy general__tab" style={{display: 'block'}}>

                    {/*<TabFilter tournamentsFilter={tournamentsFilter} changeTournamentType={this.changeTournamentType.bind(this)} />*/}

                    <div className="radio-tab-pane" id="radio1" style={{display: 'block'}}>
                        {/*<div className="desc2">*/}
                            {/*I want to Wager:*/}
                            {/**/}
                            {/*<DropDownTrigger triggerClass="dd pGExplore__dd" items={exploreDropDownItems} setAssetSymbol={this.setAssetSymbol.bind(this)}/>*/}
                        {/**/}
                        {/*</div>*/}
                        <div className="box-inner box-inner-2">
                            <div className="table__section">
                                <div className="table table2 table-pg-explore">
                                    <div className="table__head tableRow">
                                        <Translate component="div" className="tableCell" content="games.rps_game.rps_game_id" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.tournament_creator" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.registration_deadline" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.start_time" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.buy_in" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.jackpot" />
                                        <Translate component="div" className="tableCell" content="games.rps_game.players_currently_registered" />
                                        <div className="tableCell text_r">
                                            <Translate component="div" className="table__thAction" content="games.rps_game.open" />
                                        </div>
                                    </div>
                                    <div className="table__body">

                                        {exploreList.map((tournamentImm) => {
                                            let amount = tournamentImm.getIn(["options", "buy_in", "amount"]),
                                                prize = tournamentImm.get('prize_pool'),
                                                precision = tournamentImm.getIn(["options", "buy_in", "asset", "precision"]);
                                                {/*numberOfPlayers = tournamentImm.getIn(["options", "number_of_players"]);*/}

                                            return (
                                                <div key={tournamentImm.get('id')} className="tableRow">
                                                    <div className="tableCell">#RPS {tournamentImm.get('id')}</div>
                                                    <div className="tableCell">{tournamentImm.get('creator_account_name')}</div>
                                                    <div className="tableCell ">

                                                        {moment.utc(tournamentImm.getIn(["options", "registration_deadline"])).tz(moment.tz.guess()).format("MMMM D, YYYY hh:mm A Z")}

                                                    </div>
                                                    <div className="tableCell ">

                                                        <TournamentStartTime start_delay={tournamentImm.getIn(["options", "start_delay"])} start_time={tournamentImm.getIn(["options", "start_time"])} start_time_tournament={tournamentImm.getIn(["start_time"])} />

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
                                                    <div className="tableCell">
                                                        <Translate content="games.rps_game.upcoming_players_text"
                                                                   current={tournamentImm.get("registered_players") }
                                                                   total={tournamentImm.getIn(["options", "number_of_players"]) } />
                                                    </div>


                                                    <div className="tableCell text_r">

                                                        {accountId ? <JoinTournamentButton play={this.play.bind(this)} tournament={tournamentImm} joinToTournament={this.joinToTournament.bind(this)} accountId={accountId} /> : null}

                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Pagination currentPage={explorePage} countPages={exploreCountPages} offset={2} navigateTo={this.navigateTo.bind(this)} />

            </div>

        )
    }
}

Explore = connect(
    (state) => {
        return {
            accountId: state.app.accountId,
            exploreList: state.rockPaperScissorsReducer.exploreList,
            explorePage: state.rockPaperScissorsReducer.explorePage,
            exploreCountPages: state.rockPaperScissorsReducer.exploreCountPages,
            exploreDropDownItems: state.rockPaperScissorsReducer.exploreDropDownItems,
            walletLocked: state.wallet.locked,
            walletIsOpen: state.wallet.isOpen
        };
    },
    {
        /**
         * Navigate actions
         */
        navigateToGame: RockPaperScissorsNavigateActions.navigateToGame,
        navigateToAllTournaments: RockPaperScissorsNavigateActions.navigateToAllTournaments,

        /**
         * Actions
         */
        setSortExploreBy: RockPaperScissorsActions.setSortExploreBy,
        setExploreDDCurrent: RockPaperScissorsActions.setExploreDDCurrent,
        joinToTournament: RockPaperScissorsActions.joinToTournament,
        fetchExploreTournaments: RockPaperScissorsActions.fetchExploreTournaments,
        subscribe: RockPaperScissorsActions.subscribe,
        unSubscribe: RockPaperScissorsActions.unSubscribe,
        setWalletPosition: setWalletPosition
    }
)(Explore);

export default Explore;