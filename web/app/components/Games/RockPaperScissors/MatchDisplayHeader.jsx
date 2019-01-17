import React from 'react';
import MatchResultsDisplay from './MatchResultsDisplay';
import MoveTimerDisplay from './MoveTimerDisplay';

class MatchDisplayHeader extends React.Component {
  render() {
    let {players, match, games, leftPlayerIndex, rightPlayerIndex} = this.props;
    return (
      <div id='header'>
        <div id='player1'>
          <div className='player-name'>{players[leftPlayerIndex].get('name')}</div>
          <div>
            <MatchResultsDisplay playerIndex={ leftPlayerIndex } match={ match } games={ games }/>
          </div>
        </div>
        <div id='timer'>
          <MoveTimerDisplay width={ 80 } height={ 80 } currentGame={ games.last() }/>
        </div>
        <div id='player2'>
          <div className='player-name'>{players[rightPlayerIndex].get('name')}</div>
          <div><MatchResultsDisplay
            playerIndex={ rightPlayerIndex }
            match={ match }
            games={ games }/></div>
        </div>
      </div>
    );
  }
}

export default MatchDisplayHeader;