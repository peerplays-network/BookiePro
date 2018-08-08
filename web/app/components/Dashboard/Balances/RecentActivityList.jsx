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
import classNames from "classnames";
import {connect} from 'react-redux';
import counterpart from 'counterpart';
import Translate from "react-translate-component";
import CustomScroll from 'react-custom-scroll';

import RecentActivityRow from './RecentActivityRow';

@connect(state => {
    return {recentActivity: state.dashboardPage.recentActivity}
})
class RecentActivityList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            popup : false,
            sortBy : 'all'
        };
        this._closePopup = this._closePopup.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this._closePopup, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._closePopup, false);
    }

    _closePopup(){
        if(this.state.popup){
            this.setState({
                popup : false
            });
        }
    }

    _togglePopup(e){
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({
            popup : !this.state.popup
        });
    }

    onSortBy(sortBy) {
        this.setState({sortBy});
    }

    render() {

        let {recentActivity} = this.props;

        let showPopup = this.state.popup;

        let sortBy = this.state.sortBy;

        let rows;

        switch(sortBy) {
            case 'tournament':

                let operations = {
                    tournament_create: 'tournament_create',
                    tournament_join: 'tournament_join',
                    game_move: 'game_move',
                    tournament_payout_operation: 'tournament_payout_operation'
                };

                rows = recentActivity.filter(obj => {
                    return !!operations[obj.operation];
                });
                break;
            case 'transfer':
                rows = recentActivity.filter(obj => obj.type === counterpart.translate(`transaction.trxTypes.${sortBy}`));//????
                break;
            default:
                rows = recentActivity;
        }

        let recentOperations = rows.map(obj => {

            return (
                <RecentActivityRow
                    key={obj.id}
                    type = {obj.type}
                    sender={obj.sender}
                    receiver={obj.receiver}
                    description={obj.description}
                    block={obj.block}
                    memo={obj.memo}
                />
            );

        });

        return (
            <div className="table__wrap">
                <h3 className="content__headTitle mb-15"><Translate content="dashboard.recent_activity.title" /></h3>
                { this.props.recentActivity.length > 0 ?
                    <div id='recentHistoryTable' className="table table2 table-db-rec-activity table-scroll">
                        <div className="table__head no_ov clearfix">
                            <div className="tableCell">
                                <div className={classNames('tableOperation__dd', 'dd', {'open' : showPopup })}>
                                    <a className="tableOperation__trigger ddTrigger js_dropDown" onClick={this._togglePopup.bind(this)}>
                                        <span className="ddTrigger__text"><Translate content="dashboard.recent_activity.operation.title" /></span>
                                    </a>
                                    <div className="tableOperation__ddMenu ddMenu">
                                        <ul className="ddMenu__list">
                                            <li className="ddMenu__item"><a className="ddMenu__link js-sel_dropDown" onClick={this.onSortBy.bind(this, 'all')}><Translate content="dashboard.recent_activity.operation.show_all" /></a></li>
                                            <li className="ddMenu__item"><a className="ddMenu__link js-sel_dropDown" onClick={this.onSortBy.bind(this, 'tournament')}><Translate content="dashboard.recent_activity.operation.tournament_actions" /></a></li>
                                            <li className="ddMenu__item"><a className="ddMenu__link js-sel_dropDown" onClick={this.onSortBy.bind(this, 'transfer')}><Translate content="dashboard.recent_activity.operation.transfers" /></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="tableCell"><Translate content="dashboard.recent_activity.sender" /></div>
                            <div className="tableCell"><Translate content="dashboard.recent_activity.receiver" /></div>
                            <div className="tableCell"><Translate content="dashboard.recent_activity.description" /></div>
                            <div className="tableCell"><Translate content="dashboard.recent_activity.date" /></div>
                        </div>

                        <CustomScroll allowOuterScroll={true}>
                            <div className="table__body table__scroll maxHeight-620">
                                {recentOperations}
                            </div>
                        </CustomScroll>

                    </div> : null
                }
            </div>
        )
    }
}
 export default RecentActivityList;
