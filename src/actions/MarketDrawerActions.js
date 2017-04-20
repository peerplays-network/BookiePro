import { ActionTypes } from '../constants';
import Immutable from 'immutable';
import { BettingModuleUtils } from '../utility';

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

  //NOTE  to be removed once edit of stake is done
  static createDummyBet(record, team, betType, betting_market_id, offer) {

    //generate a random number to simulate the change in stake
    const randomStake = (Math.random() * (0.800 - 0.100) + 0.100).toFixed(3);

    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        bet_type: betType,
        betting_market_id: betting_market_id,
        offer: offer,

        stake: randomStake,
        profit:  offer ? BettingModuleUtils.getProfitOrLiability( randomStake, offer.get('odds') ) : 0,
        liability:  offer ? BettingModuleUtils.getProfitOrLiability( randomStake, offer.get('odds') ) : 0
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
