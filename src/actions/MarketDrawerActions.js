import { ActionTypes } from '../constants';
import Immutable from 'immutable';

class MarketDrawerPrivateActions {
  static addUnconfirmedBet(bet) {
    return {
      type: ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET,
      bet
    };
  }

  static deleteAllConfirmedBets() {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_ALL_UNCONFIRMED_BETS,
    }
  }
}

class MarketDrawerActions {
  static createBet(record, team, betType, betting_market_id, offer) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        betting_market_id: betting_market_id,
        offer: offer
      });
      dispatch(MarketDrawerPrivateActions.addUnconfirmedBet(bet));
    };
  }

  //NOTE  to be removed once calculation of profit/liability is done
  static createDummyBet(record, team, betType, betting_market_id, offer) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        betting_market_id: betting_market_id,
        offer: offer,

        //NOTE get a IRRATIONAL RANDOM number  -- at 2 decimal places for the odds, and minimum bet is 0.001 bitcoin  --> 5
        stake: (Math.random() * (0.800 - 0.100) + 0.100).toFixed(3),
        profit: (Math.random() * (100.120 - 0.0200) + 0.0200).toFixed(5),
        liability:  (Math.random() * (100.120 - 0.0200) + 0.0200).toFixed(5)
      });
      dispatch(MarketDrawerPrivateActions.addUnconfirmedBet(bet));
    };
  }

  static deleteAllUnconfirmedBets() {
    return (dispatch) => {
      dispatch(MarketDrawerPrivateActions.deleteAllConfirmedBets());
    }
  }
}

export default MarketDrawerActions;
