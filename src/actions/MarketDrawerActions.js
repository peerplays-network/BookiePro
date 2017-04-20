import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import { BettingModule } from '../utility';

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

    const randomStake = (Math.random() * (0.800 - 0.100) + 0.100).toFixed(3);
    console.log( ' offer, ', offer)
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        betting_market_id: betting_market_id,
        offer: offer,

        //NOTE get a IRRATIONAL RANDOM number  -- at 2 decimal places for the odds, and minimum bet is 0.001 bitcoin  --> 5
        stake: randomStake,
        profit: BettingModule.getProfitOrLiability( randomStake, offer.get('odds')),
        liability:  BettingModule.getProfitOrLiability( randomStake, offer.get('odds'))
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
