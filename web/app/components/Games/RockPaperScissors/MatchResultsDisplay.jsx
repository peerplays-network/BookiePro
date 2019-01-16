import React from 'react';

class MatchResultsDisplay extends React.Component {
  render() {
    if (!this.props.match) {
      return null;
    }

    let myPlayerId = this.props.match.getIn(['players', this.props.playerIndex]);
    let results = this.props.games.map((game, gameIndex) => {
      if (!game) {
        return {
          gameId: gameIndex.toString(),
          result: 'unknown',
          gesture: 'unknown',
          type: 'unknown'
        };
      }

      let winLoseDraw = 'unknown';

      if (game.get('state') === 'game_complete') {
        let winners = game.get('winners');

        if (winners.includes(myPlayerId)) {
          winLoseDraw = 'win';
        } else if (winners.isEmpty()) {
          winLoseDraw = 'draw';
        } else {
          winLoseDraw = 'lose';
        }
      }

      let type = 'unknown';
      let gesture = 'unknown';
      let commitMove = game.getIn(['game_details', 1, 'commit_moves', this.props.playerIndex]);
      let revealMove = game.getIn(['game_details', 1, 'reveal_moves', this.props.playerIndex]);

      if (revealMove) {
        gesture = revealMove.get('gesture');
        type = commitMove
          ? 'user'
          : 'automatic';
      }

      return {
        gameId: game.get('id'),
        result: winLoseDraw,
        gesture: gesture,
        type: type
      };
    });
    let resultElements = results.map((result) => {
      return (
        <div
          key={ this.props.playerIndex.toString() + '_' + result.gameId }
          className={ 'result-bubble result-' + result.result }
        >
          <span className={ result.gesture }/>
        </div>
      );
    });
    return (
      <span>{resultElements}</span>
    );
  }
}

export default MatchResultsDisplay;
