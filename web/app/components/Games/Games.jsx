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

class Games extends React.Component {

    render() {
        return (
            <div className="main">
                <section className="content">
                    <div className="box">
                        <div className="content__head noBd">
                            <Translate component="h1" className="h1__main text_c" content="games.title" />
                        </div>
                        <div className="pG__section2Wrap">
                            <div className="pG__section2WrapIn">
                                <div className="pG__section2 ">
                                    <div className="pG__section2Link">
									<span className="pG__section2Pic">
										<img src="images/playGames/pic04.png" alt=""/>
									</span>
                                        <span className="pG__section2Text">
										Coming Soon...
									</span>
                                    </div>
                                </div>
                                <div className="pG__section2 ">
                                    <div className="pG__section2Link">
									<span className="pG__section2Pic">
										<img src="images/playGames/pic05.png" alt=""/>
									</span>
                                        <span className="pG__section2Text">
										Coming Soon...
									</span>
                                    </div>
                                </div>
                                <div className="pG__section2 ">
                                    <div className="pG__section2Link">
									<span className="pG__section2Pic">
										<img src="images/playGames/pic06.png" alt=""/>
									</span>
                                        <span className="pG__section2Text">
										Coming Soon...
									</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/*<div className="pG__sectionWrap">*/}
                            {/*<div className="clearfix">*/}
                                {/*<div className="pG__section col col-4">*/}
                                    {/*<Link to="/games/rock-paper-scissors" className="pG__sectionLink">*/}
                                        {/*<span className="pG__sectionPic lg">*/}
                                            {/*<img src="images/games/rps/bkg.png" alt=""/>*/}
                                        {/*</span>*/}
                                        {/*<Translate component="span" className="pG__sectionText" content="games.rps_game.name" />*/}
                                    {/*</Link>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <div className="h50"></div>
                    </div>
                </section>
            </div>
        )
    }

}

export default Games;