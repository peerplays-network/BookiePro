import React from 'react';
import {connect} from 'react-redux';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import asset_utils from 'common/asset_utils';
import {FormattedNumber} from 'react-intl';
import TournamentStartTime from './TournamentStartTime';
import JoinTournamentButton from './JoinTournamentButton';
import {setWalletPosition} from 'actions/RWalletUnlockActions';
import RockPaperScissorsActions from 'actions/Games/RockPaperScissors/RockPaperScissorsActions';
import DropDownTrigger from './DropDownTrigger';

let callback = {
  exists: false,
  run: null
};

class Find extends React.Component {
  componentWillUpdate(nextProps) {
    const {walletLocked} = this.props;

    if (!nextProps.walletLocked && nextProps.walletLocked !== walletLocked) {
      if (callback.exists && callback.run) {
        callback.exists = false;
        callback.run(nextProps.walletLocked);
        callback.run = null;
      }
    }
  }

  componentWillMount() {
    this.props.subscribe('find');
    this.props.fetchFindTournaments();
  }

  componentWillUnmount() {
    this.props.unSubscribe('find');
  }

  setAssetSymbol(unitId) {
    setTimeout(() => {
      this.props.setFindDDCurrent(unitId);
    }, 0);
  }

  joinToTournament(tournamentId) {
    let {walletLocked, isOpen} = this.props;

    if (walletLocked && !isOpen) {
      callback.exists = true;
      callback.run = this.props.joinToTournament.bind(this, tournamentId);
      this.props.setWalletPosition(true);
      return;
    }

    this.props.joinToTournament(tournamentId);
  }

  render() {
    let {findList, accountId, findDropDownItems} = this.props;

    let numPlayersObject = Object.create(null);
    findList.forEach((tournamentImm) => {
      let item = tournamentImm.toJS(),
        amount = tournamentImm.getIn(['options', 'buy_in', 'amount']),
        prize = tournamentImm.get('prize_pool'),
        precision = tournamentImm.getIn(['options', 'buy_in', 'asset', 'precision']),
        numberOfPlayers = tournamentImm.getIn(['options', 'number_of_players']);

      if (!numPlayersObject[numberOfPlayers]) {
        numPlayersObject[numberOfPlayers] = [];
      }

      numPlayersObject[numberOfPlayers].push((
        <div key={ item.id } className='tableRow'>
          <div className='tableCell '>
            <FormattedNumber
              value={ amount && precision
                ? amount / Math.pow(10, precision)
                : 0 }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ precision }/>
            <span>
              {asset_utils.getSymbol(tournamentImm.getIn(['options', 'buy_in', 'asset', 'symbol']))}
            </span>
          </div>
          <div className='tableCell '>
            <FormattedNumber
              value={ prize && precision
                ? prize / Math.pow(10, precision)
                : 0 }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ precision }/>
            <span>
              {asset_utils.getSymbol(tournamentImm.getIn(['options', 'buy_in', 'asset', 'symbol']))}
            </span>
          </div>
          <div className='tableCell'>
            <Translate
              content='games.rps_game.upcoming_players_text'
              current={ tournamentImm.get('registered_players') }
              total={ tournamentImm.getIn(['options', 'number_of_players']) }/>
          </div>
          <div className='tableCell '>
            <TournamentStartTime
              start_delay={ tournamentImm.getIn(['options', 'start_delay']) }
              start_time={ tournamentImm.getIn(['options', 'start_time']) }/>
          </div>
          <div className='tableCell text_r'>
            {accountId
              ? <JoinTournamentButton
                tournament={ tournamentImm }
                joinToTournament={ this
                  .joinToTournament
                  .bind(this) }
                accountId={ accountId }/>
              : null}
          </div>
        </div>
      ));
    });

    let numKeys = Object.keys(numPlayersObject);
    let list = numKeys.map((numberOfPlayers) => {
      return (
        <div key={ numberOfPlayers } className='table__section'>
          <div className='table2__title'>
            {counterpart.translate('games.rps_game.num_players', {num: numberOfPlayers})}
          </div>
          <div className='table table2 table-pg-find'>
            <div className='table__head tableRow'>
              <Translate
                component='div'
                className='tableCell'
                content='games.rps_game.buy_in'/>
              <Translate
                component='div'
                className='tableCell'
                content='games.rps_game.jackpot'/>
              <Translate
                component='div'
                className='tableCell'
                content='games.rps_game.players_currently_registered'/>
              <Translate
                component='div'
                className='tableCell'
                content='games.rps_game.start_time'/>
              <div className='tableCell text_r'>
                <Translate
                  component='div'
                  className='table__thAction'
                  content='games.rps_game.join'/>
              </div>
            </div>
            <div className='table__body'>
              {numPlayersObject[numberOfPlayers]}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div
        id='explore'
        className='tab__deploy general__tab'
        style={ {
          display: 'block'
        } }>
        <div
          className='radio-tab-pane'
          id='radio1'
          style={ {
            display: 'block'
          } }>
          <div className='desc2'>
            <Translate
              component='span'
              className=''
              content='games.rps_game.i_want_to_wager'/>
            <DropDownTrigger
              triggerClass='dd pGExplore__dd'
              items={ findDropDownItems }
              setAssetSymbol={ this.setAssetSymbol.bind(this) }/>
          </div>
          <div className='box-inner box-inner-2'>
            {list}
          </div>
        </div>
      </div>
    );
  }
}

Find = connect((state) => {
  return {accountId: state.app.accountId,
    findList: state.rockPaperScissorsReducer.findList,
    findDropDownItems: state.rockPaperScissorsReducer.findDropDownItems,
    walletLocked: state.wallet.locked,
    walletIsOpen: state.wallet.isOpen
  };
}, {
  setFindDDCurrent: RockPaperScissorsActions.setFindDDCurrent,
  joinToTournament: RockPaperScissorsActions.joinToTournament,
  fetchFindTournaments: RockPaperScissorsActions.fetchFindTournaments,
  subscribe: RockPaperScissorsActions.subscribe,
  unSubscribe: RockPaperScissorsActions.unSubscribe,
  setWalletPosition: setWalletPosition
})(Find);

export default Find;