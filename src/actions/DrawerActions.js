import {ActionTypes} from '../constants';
import Immutable from "immutable";

class PrivateDrawerActions {
  static deleteManyBets(listOfBetIds) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_MANY_BETS,
      listOfBetIds
    }
  }
  static deleteManyUnconfirmedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS,
      listOfBetIds
    }
  }
}

class DrawerActions {
  // 'bets' passed in CAN contain unplaced bets from both the marketDrawer and the quickBetDrawer.
  static deleteBets(bettingMarketIds) {
    return (dispatch, getState) => {
      // Get all unplaced bets from state. There exists two locations for them.
      const unconfirmedBets = getState().getIn(['marketDrawer', 'unconfirmedBets']);
      const bets = getState().getIn(['quickBetDrawer', 'bets']);
      // Concatinate the unplaced bets
      const unplacedBets = unconfirmedBets.concat(bets);
      var betsToDelete = Immutable.List();
      if (bettingMarketIds.size === 1){
        betsToDelete = unplacedBets.filter(bet => bet.includes(bettingMarketIds.toJS()[0]));
      } else {
        // Loop through the betting market ids list for bms that have been updated.
        for(let i=0;i < bettingMarketIds.size; i++){
          // pull the betting market id out for the current index
          let id = bettingMarketIds.get(i);
          // Filter the unplacedBets list for bets that belong to a betting market that has been updated. (Determined by bettingMarketIds).
          betsToDelete = betsToDelete.concat(unplacedBets.filter(bet => {
            return bet.get('betting_market_id') === id;
          }));
        }
      }

      // Dispatch the deletion actions for the two drawers with the betsToDelete list.
      // 'unconfirmedBets' can be see in redux state under Market Drawer.
      dispatch(PrivateDrawerActions.deleteManyUnconfirmedBets(betsToDelete.map(b => b.get('id')))); 
      // 'bets' can be seen in redux state under Quick Bet Drawer.
      dispatch(PrivateDrawerActions.deleteManyBets(betsToDelete.map(b => b.get('id')))); 
    }
  }
}

export default DrawerActions;
