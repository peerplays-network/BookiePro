import React from 'react';
import {connect} from 'react-redux';
import GestureSelector from './GestureSelector';
import MatchDisplayHeader from './MatchDisplayHeader';
import AwaitingTimerDisplay from './AwaitingTimerDisplay';
import ConcludedGameContent from './ConcludedGameContent';
import counterpart from 'counterpart';
import RockPaperScissorsActions from 'actions/Games/RockPaperScissors/RockPaperScissorsActions';
import RWalletUnlockNewActions from 'actions/RWalletUnlockNewActions';
import moment from 'moment-timezone';
import TimeHelper from 'helpers/TimeHelper';
import Translate from 'react-translate-component';

require('./_play.scss'); //TODO::RM
class RockPaperScissorsGame extends React.Component {
  componentWillMount() {
    this.props.subscribe('rps');
    this.props.setGame(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.unSubscribe('rps');
    this.props.setGame(null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.unSubscribe('rps');
      this.props.setGame(nextProps.params.id);
      this.props.subscribe('rps');
    }
  }

  render() {
    let {
        match,
        accountId,
        players,
        games,
        status,
        start_time,
        end_time,
        matchList
      } = this.props,
      content = null;

    switch (status) {
      case 'concluded':
        content = (
          <div>
            <h1>{counterpart.translate('games.rps_game.game_status')}: {status}
              / {counterpart.translate('games.rps_game.start_time')}
              : {moment(TimeHelper.timeStringToDate(start_time)).format('MMMM D, YYYY hh:mm A Z')}
              / {counterpart.translate('games.rps_game.end_time')}:
              {moment(TimeHelper.timeStringToDate(end_time)).format('MMMM D, YYYY hh:mm A Z')}
            </h1>
            <ConcludedGameContent matchList={ matchList }/>
          </div>
        );
        break;
      case 'awaiting_start':
        content = (
          <div>
            <h1>{counterpart.translate('games.rps_game.game_status')}: {status}
              / {counterpart.translate('games.rps_game.start_time')}:
              {moment(TimeHelper.timeStringToDate(start_time)).format('MMMM D, YYYY hh:mm A Z')}
            </h1>
            <AwaitingTimerDisplay start_time={ start_time } width={ 80 } height={ 80 }/>
          </div>
        );
        break;
      case 'in_progress':
        if (!match || !accountId) {
          return null;
        }

        // we want to display the player controlled by our wallet on the left
        let leftPlayerIndex = 0;
        let rightPlayerIndex = 1;

        if (this.props.match.getIn(['players', 0]) !== accountId) {
          leftPlayerIndex = 1;
          rightPlayerIndex = 0;
        }

        let state = match.get('state'); /* eslint-disable-line */
        let previousGame = games.size > 1
          ? games.get(games.size - 2)
          : null;
        let currentGame = games.last();

        content = (
          <div id='active-match'>
            <div id='header-shade'>
              <MatchDisplayHeader
                games={ games }
                players={ players }
                leftPlayerIndex={ leftPlayerIndex }
                rightPlayerIndex={ rightPlayerIndex }
                match={ match }/>
            </div>
            <div id='gesture-selectors'>
              <div id='first-player'>
                <Translate component='span' content='games.rps_game.first_player'/>
                <GestureSelector
                  tournament_id={ this.props.params.id }
                  reveal_moves={ this.props.reveal_moves }
                  getActiveKeyFromState={ this.props.getActiveKeyFromState }
                  commitMove={ this.props.commitMove }
                  isMyAccount={ true }
                  previousGame={ previousGame }
                  currentGame={ currentGame }
                  playerIndex={ leftPlayerIndex }
                  width={ 400 }
                  height={ 400 }/>
              </div>
              <div id='second-player'>
                <Translate component='span' content='games.rps_game.second_player'/>
                <GestureSelector
                  tournament_id={ this.props.params.id }
                  reveal_moves={ this.props.reveal_moves }
                  isMyAccount={ false }
                  previousGame={ previousGame }
                  currentGame={ currentGame }
                  playerIndex={ rightPlayerIndex }
                  width={ 400 }
                  height={ 400 }/>
              </div>
            </div>
          </div>
        );
        break;
      default:
        content = (
          <h1>{counterpart.translate('games.rps_game.no_in_progress')}</h1>
        );
    }

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <h1 className='h1 h1__main'>
              {counterpart.translate('games.rps_game.name')}
              {counterpart.translate('games.rps_game.game_id')}
              {this.props.params.id}
            </h1>
            {content}
          </div>
        </section>
      </div>
    );
  }
}

RockPaperScissorsGame = connect((state) => {
  return {
    activeGameId: state.rockPaperScissorsReducer.activeGameId,
    match: state.rockPaperScissorsReducer.match,
    players: state.rockPaperScissorsReducer.players,
    games: state.rockPaperScissorsReducer.games,
    status: state.rockPaperScissorsReducer.status,
    start_time: state.rockPaperScissorsReducer.start_time,
    end_time: state.rockPaperScissorsReducer.end_time,
    matchList: state.rockPaperScissorsReducer.matchList,
    accountId: state.app.accountId,
    reveal_moves: state.walletData.wallet && state.walletData.wallet.reveal_moves
      ? state.walletData.wallet.reveal_moves
      : null
  };
}, {
  subscribe: RockPaperScissorsActions.subscribe,
  unSubscribe: RockPaperScissorsActions.unSubscribe,
  setGame: RockPaperScissorsActions.setGame,
  commitMove: RockPaperScissorsActions.commitMove,

  getActiveKeyFromState: RWalletUnlockNewActions.getActiveKeyFromState
})(RockPaperScissorsGame);

export default RockPaperScissorsGame;