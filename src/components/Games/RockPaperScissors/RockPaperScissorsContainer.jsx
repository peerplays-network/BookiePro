import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Translate from 'react-translate-component';
import Find from './Find';
import Explore from './Explore';
import Create from './Create';
import Dashboard from './Dashboard';
import {RockPaperScissorsActions, RockPaperScissorsNavigateActions} from '../../../actions';
import {bindActionCreators} from 'redux';

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

const mapStateToProps = (state) => {
  return {
    tab: state.rockPaperScissorsReducer.tab,
    tournamentsFilter: state.rockPaperScissorsReducer.tournamentsFilter
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    changeTabParams: RockPaperScissorsActions.changeTabParams,
    navigateToCreateTournament: RockPaperScissorsNavigateActions.navigateToCreateTournament,
    navigateToDashboardTournaments: RockPaperScissorsNavigateActions.navigateToDashboardTournaments,
    navigateToOpenTournaments: RockPaperScissorsNavigateActions.navigateToOpenTournaments,
    navigateToAllTournaments: RockPaperScissorsNavigateActions.navigateToAllTournaments
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(RockPaperScissorsContainer);