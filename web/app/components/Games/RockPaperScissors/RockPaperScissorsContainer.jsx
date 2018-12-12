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
import {connect} from 'react-redux';
import classNames from 'classnames';
import Translate from 'react-translate-component';
import Find from './Find';
import Explore from './Explore';
import Create from './Create';
import Dashboard from './Dashboard';
import RockPaperScissorsActions from 'actions/Games/RockPaperScissors/RockPaperScissorsActions';
import RockPaperScissorsNavigateActions from 'actions/Games/RockPaperScissors/RockPaperScissorsNavigateActions'; /* eslint-disable-line */

class RockPaperScissorsContainer extends React.Component {
  componentDidMount() {
    this.props.changeTabParams({
      tab: this.props.route.params.tab,
      tournamentsFilter: this.props.route.params.tournamentsFilter
    });
  }

  componentWillReceiveProps(nextProps) {
    let {tab, tournamentsFilter} = nextProps.route.params;

    if (this.props.tournamentsFilter !== tournamentsFilter || tab !== this.props.tab) {
      this.props.changeTabParams({
        tab: tab,
        tournamentsFilter: (tournamentsFilter)
          ? tournamentsFilter
          : this.props.tournamentsFilter
      });
    }
  }

  changeTab(tab, e) {
    switch (tab) {
      case 'create':
        this.props.navigateToCreateTournament();
        break;
      case 'dashboard':
        this.props.navigateToDashboardTournaments();
        break;
      case 'find':
        this.props.navigateToOpenTournaments();
        break;
      case 'explore':
        this.props.navigateToAllTournaments();
        break;
    }

    e.preventDefault();
  }

  render() {
    let {tab, tournamentsFilter} = this.props;
    let tabContent = null;

    switch (tab) {
      case 'create':
        tabContent = <Create/>;
        break;
      case 'dashboard':
        tabContent = <Dashboard/>;
        break;
      case 'explore':
        tabContent = <Explore
          page={
            this.props.location.query &&
            this.props.location.query.page &&
            !isNaN(parseInt(this.props.location.query.page))
              ? Math.max(Math.abs(parseInt(this.props.location.query.page)), 1)
              : 1 }
          tournamentsFilter={ tournamentsFilter }/>;
        break;
      case 'find':
        tabContent = <Find/>;
        break;
    }

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <Translate
              component='h1'
              className='h1 h1__main'
              content='games.rps_game.title_tabs'/>
            <ul className='tab__list'>
              <li className='tab__item'>
                <a
                  href='#dashboard'
                  className={ classNames('tab__link', {
                    active: tab === 'dashboard'
                  }) }
                  onClick={ this.changeTab.bind(this, 'dashboard') }>
                  <Translate
                    component='span'
                    className=''
                    content='games.rps_game.tabs.dashboard'/>
                </a>
              </li>
              <li className='tab__item'>
                <a
                  href='#find'
                  className={ classNames('tab__link', {
                    active: tab === 'find'
                  }) }
                  onClick={ this.changeTab.bind(this, 'find') }>
                  <Translate component='span' className='' content='games.rps_game.tabs.find'/>
                </a>
              </li>
              <li className='tab__item'>
                <a
                  href='#explore'
                  className={ classNames('tab__link', {
                    active: tab === 'explore'
                  }) }
                  onClick={ this.changeTab.bind(this, 'explore') }>
                  <Translate component='span' className='' content='games.rps_game.tabs.explore'/>
                </a>
              </li>
              <li className='tab__item'>
                <a
                  href='#create'
                  className={ classNames('tab__link', {
                    active: tab === 'create'
                  }) }
                  onClick={ this.changeTab.bind(this, 'create') }>
                  <Translate
                    component='span'
                    className=''
                    content='games.rps_game.tabs.create_new'/>
                </a>
              </li>
            </ul>
            {tabContent}
          </div>
        </section>
      </div>
    );
  }
}

RockPaperScissorsContainer = connect((state) => {
  return {
    tab: state.rockPaperScissorsReducer.tab,
    tournamentsFilter: state.rockPaperScissorsReducer.tournamentsFilter
  };
}, {
  /**
 * Game actions
 */
  changeTabParams: RockPaperScissorsActions.changeTabParams,

  /**
 * Navigate actions
`*/
  navigateToCreateTournament: RockPaperScissorsNavigateActions.navigateToCreateTournament,
  navigateToDashboardTournaments: RockPaperScissorsNavigateActions.navigateToDashboardTournaments,
  navigateToOpenTournaments: RockPaperScissorsNavigateActions.navigateToOpenTournaments,
  navigateToAllTournaments: RockPaperScissorsNavigateActions.navigateToAllTournaments
})(RockPaperScissorsContainer);

export default RockPaperScissorsContainer;