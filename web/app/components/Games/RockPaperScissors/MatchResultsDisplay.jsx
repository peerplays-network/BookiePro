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

import React from 'react';

class MatchResultsDisplay extends React.Component {


    render() {

        if (!this.props.match) {
            return null;
        }


        let myPlayerId = this.props.match.getIn(["players", this.props.playerIndex]);
        let results = this.props.games.map( (game, gameIndex) => {
            if (!game)
                return { gameId: gameIndex.toString(), result: "unknown", gesture: "unknown", type: "unknown"};
            let winLoseDraw = "unknown";
            if (game.get("state") === "game_complete") {
                let winners = game.get("winners");
                if (winners.includes(myPlayerId))
                    winLoseDraw = "win";
                else if (winners.isEmpty())
                    winLoseDraw = "draw";
                else
                    winLoseDraw = "lose";
            }

            let type = "unknown";
            let gesture = "unknown";
            let commitMove = game.getIn(["game_details", 1, "commit_moves", this.props.playerIndex]);
            let revealMove = game.getIn(["game_details", 1, "reveal_moves", this.props.playerIndex]);
            if (revealMove) {
                gesture = revealMove.get("gesture");
                type = commitMove ? "user" : "automatic";
            }

            return { gameId: game.get("id"), result: winLoseDraw, gesture: gesture, type: type };
        });
        let resultElements = results.map( result => {
            return (<div key={this.props.playerIndex.toString() + "_" + result.gameId} className={"result-bubble result-" + result.result}><span className={result.gesture} /></div>);
        });
        return (<span>{resultElements}</span>);

    }
}

export default MatchResultsDisplay;
