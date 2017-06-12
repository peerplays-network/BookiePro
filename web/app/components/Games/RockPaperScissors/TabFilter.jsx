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
import RockPaperScissorsNavigateActions from "actions/Games/RockPaperScissors/RockPaperScissorsNavigateActions"


class TabFilter extends React.Component {

    changeTournamentType(type) {
        this.props.changeTournamentType(type);
    }

    render() {

        let {tournamentsFilter} = this.props;

        return (
            <div className="tab__deployHead">
                <div className="pG__radioWrap">
                    <label className="customRadio__label pG__radioItem">
                        <span className="customRadio__labelRelative">
                            <input type="radio" className="customRadio__check " name="name1" checked={tournamentsFilter === 'open'} onChange={this.changeTournamentType.bind(this, 'open')} />
                            <span className="customRadio__checkPseudo"></span>
                        </span>
                        <span className="customRadio__labelPseudo">Find an Open Tournament</span>
                    </label>
                    <label className="customRadio__label pG__radioItem">
                        <span className="customRadio__labelRelative">
                            <input type="radio" className="customRadio__check " name="name1" checked={tournamentsFilter === 'all'} onChange={this.changeTournamentType.bind(this, 'all')} />
                            <span className="customRadio__checkPseudo"></span>
                        </span>
                        <span className="customRadio__labelPseudo">Explore All Tournaments</span>
                    </label>
                </div>
            </div>
        )
    }
}

export default TabFilter;