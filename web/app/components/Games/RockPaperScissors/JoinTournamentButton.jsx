import React from 'react';
import Translate from 'react-translate-component';
import moment from 'moment';
import TimeHelper from 'helpers/TimeHelper';

class JoinTournamentButton extends React.Component {
  _join(e) {
    if (this.props.joinToTournament) {
      this.props.joinToTournament(this.props.tournament.get('id'));
    }

    e.preventDefault();
  }

  _play(id) {
    if (this.props.play) {
      this.props.play(id);
    }
  }

  render() {
    if (!this.props.accountId || !this.props.tournament) {
      return null;
    }

    let accountId = this.props.accountId,
      tournament = this.props.tournament,
      tournamentId = this.props.tournament.get('id'),
      tournamentState = tournament.get('state'),
      registeredPlayers = tournament.getIn(['tournament_details', 'registered_players']).toArray(),
      numberOfPlayers = tournament.getIn(['options', 'number_of_players']),
      whitelistedplayers = tournament.getIn(['options','whitelist']).toArray();

    if (tournamentState === 'concluded') {
      return null;
    }

    if (registeredPlayers.includes(accountId)) {
      switch (tournamentState) {
        case 'awaiting_start':
          let ms = moment().diff(moment(TimeHelper.timeStringToDate(tournament.get('start_time')))),
            d = moment.duration(ms),
            minutes = d.asMinutes();

          if (minutes <= -10) {
            return (
              <Translate
                component='button'
                content='games.rps_game.already_registered'
                disabled={ true }
                className={ 'btn btn-join' } />
            );
          } else {
            return (
              <Translate
                component='button'
                content='games.rps_game.play'
                onClick={ this._play.bind(this, tournamentId) }
                disabled={ false }
                className={ 'btn btn-play' } />
            );
          }

        case 'in_progress':
          return (
            <Translate
              component='button'
              content='games.rps_game.play'
              onClick={ this._play.bind(this, tournamentId) }
              disabled={ false }
              className={ 'btn btn-play' } />
          );
        case 'registration_period_expired':
          return (
            <Translate
              component='button'
              content='games.rps_game.join'
              disabled={ true }
              className={ 'btn btn-join' } />
          );
        default:
          return (
            <Translate
              component='button'
              content='games.rps_game.already_registered'
              disabled={ true }
              className={ 'btn btn-join' } />
          );
      }
      // return (
      //  (tournamentState === 'in_progress')
      //  ? <Translate
      // component='button'
      // content='games.rps_game.play'
      // disabled={ false }
      // className={ 'btn btn-play' } />
      // : <Translate
      // component='button'
      // content='games.rps_game.already_registered'
      // disabled={ true }
      // className={ 'btn btn-join' } />
      // );
    } else {
      if (tournamentState === 'registration_period_expired') {
        return (
          <Translate
            component='button'
            content='games.rps_game.join'
            disabled={ true }
            className={ 'btn btn-join' } />
        );
      }

      if (registeredPlayers.length === numberOfPlayers) {
        return (
          <Translate
            component='button'
            content='games.rps_game.join'
            disabled={ true }
            className={ 'btn btn-join' } />
        );
      } else {
        if(whitelistedplayers.length !== 0) {
          if(whitelistedplayers.includes(accountId)) {
            return (
              <Translate
                content='games.rps_game.join'
                component='button'
                className={ 'btn btn-join' }
                onClick={ this._join.bind(this) } />
            );
          } else {
            return (
              <Translate
                component='button'
                content='games.rps_game.join'
                disabled={ true }
                className={ 'btn btn-join' } />
            );
          }
        } else {
          return (
            <Translate
              content='games.rps_game.join'
              component='button'
              className={ 'btn btn-join' }
              onClick={ this._join.bind(this) } />
          );
        }
      }
    }
  }
}

export default JoinTournamentButton;
