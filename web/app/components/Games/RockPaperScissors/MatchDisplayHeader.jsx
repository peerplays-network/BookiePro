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