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
import Translate from "react-translate-component";
import Icon from "../Icon/Icon";

class ExplorerCard extends React.Component {

    render() {

        return (
            <div className="grid-content">
                <div className="card">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Explorer extends React.Component {

    render() {

        return (
            <div className="grid-block page-layout flex-start">
                <div className="grid-block regular-padding small-up-1 medium-up-2 large-up-3">
                        <ExplorerCard>
                            <Link to="explorer/blocks">
                                <div>
                                    <Icon name="blocks" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.blocks.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/assets">
                                <div>
                                    <Icon name="assets" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.assets.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/accounts">
                                <div>
                                    <Icon name="accounts" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.accounts.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/witnesses">
                                <div>
                                    <Icon name="witnesses" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.witnesses.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/committee-members">
                                <div>
                                    <Icon name="committee_members" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.committee_members.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/markets">
                                <div>
                                    <Icon name="markets" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="markets.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        <ExplorerCard>
                            <Link to="explorer/fees">
                                <div>
                                    <Icon name="fees" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="fees.title" />
                                </div>
                            </Link>
                        </ExplorerCard>
                        {/*<ExplorerCard>
                            <Link to="blocks">
                                <div>
                                    <Icon name="proposals" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.proposals.title" />
                                </div>
                            </Link>
                        </ExplorerCard>*/}
                    </div>

            </div>
        );
    }
}

export default Explorer;
