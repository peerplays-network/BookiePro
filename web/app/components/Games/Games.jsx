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
                                {/*<div className="pG__section2 ">
                                    <div className="pG__section2Link">
                      									<span className="pG__section2Pic">
                      										<img src="images/playGames/pic06.png" alt=""/>
                      									</span>
                                        <span className="pG__section2Text">
                      										  Coming Soon...
                      									</span>
                                    </div>
                                </div> */}

                                <hr className='gamesHR' />

                                <div className="pG__section2 ">
                                    <div className="pG__section2Link">
                      									<span className="pG__section2Pic">
                                          <img src="images/playGames/logo.png" />
                      									</span>
                                        <a className="pG__section2LinkText" target='_blank' href='http://helmbet.com/'>
                      										  Rock Paper Scissors
                      									</a>
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
