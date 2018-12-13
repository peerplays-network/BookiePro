import React from 'react';
import moment from 'moment-timezone';
import TimeHelper from 'helpers/TimeHelper';
import counterpart from 'counterpart';
class ConcludedGameContent extends React.Component {
  render() {
    let {matchList} = this.props;
    let matchListContent = matchList.map((match) => {

      let gamesList = match.get('games').map((game) => {
        return (
          <tr key={ game.get('id') }>
            <td>{game.get('id')}</td>
            <td>{game.get('gesture0')
              ? game.get('gesture0')
              : '—'}</td>
            <td>{game.get('gesture1')
              ? game.get('gesture1')
              : '—'}</td>
            <td>{game.get('winner')
              ? game.get('winner')
              : '—'}</td>
          </tr>
        );
      });

      return (
        <div key={ match.get('id') }>
          <div>{counterpart.translate('games.rps_game.match_id')} {match.get('id')}</div>
          <table className='table'>
            <tbody>
              <tr>
                <td>{counterpart.translate('games.rps_game.player_1st')}</td>
                <td>{match.get('playerName1')}</td>
              </tr>
              <tr>
                <td>{counterpart.translate('games.rps_game.player_2nd')}</td>
                <td>{match.get('playerName2')}</td>
              </tr>
              <tr>
                <td>{counterpart.translate('games.rps_game.start_time')}</td>
                <td>
                  {
                    moment(TimeHelper.timeStringToDate(match.get('start_time')))
                      .format('MMMM D, YYYY hh:mm A Z')
                  }
                </td>
              </tr>
              <tr>
                <td>{counterpart.translate('games.rps_game.end_time')}</td>
                <td>
                  {
                    moment(TimeHelper.timeStringToDate(match.get('end_time')))
                      .format('MMMM D, YYYY hh:mm A Z')
                  }
                </td>
              </tr>
            </tbody>
          </table>
          <table className='table'>
            <tbody>
              <tr>
                <th>{counterpart.translate('games.rps_game.game_id')}</th>
                <th>{counterpart.translate('games.rps_game.first_player')}</th>
                <th>{counterpart.translate('games.rps_game.second_player')}</th>
                <th>{counterpart.translate('games.rps_game.winner')}</th>
              </tr>

              {gamesList}

            </tbody>
          </table>
        </div>
      );
    });
    return (
      <div>
        {matchListContent}
      </div>
    );
  }
}

export default ConcludedGameContent;