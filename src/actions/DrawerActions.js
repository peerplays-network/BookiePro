import {ActionTypes, LoadingStatus} from '../constants';
import Immutable from 'immutable';
import {MarketDrawerActions} from '.';

class PrivateDrawerActions {
  static deleteManyBets(listOfBetIds) {
    return {
      type: ActionTypes.QUICK_BET_DRAWER_DELETE_MANY_BETS,
      listOfBetIds
    };
  }
  static deleteManyUnconfirmedBets(listOfBetIds) {
    return {
      type: ActionTypes.MARKET_DRAWER_DELETE_MANY_UNCONFIRMED_BETS,
      listOfBetIds
    };
  }
}

class DrawerActions {
  // 'bets' passed in CAN contain unplaced bets from both the marketDrawer and the quickBetDrawer.
  static deleteBets(bettingMarketIds) {
    return (dispatch, getState) => {
      // Get all unplaced bets from state. There exists two locations for them.
      dispatch(MarketDrawerActions.updateOpenBetsLoadingStatus(LoadingStatus.LOADING));
      const unconfirmedBets = getState().getIn(['marketDrawer', 'unconfirmedBets']);
      const bets = getState().getIn(['quickBetDrawer', 'bets']);
      // Concatinate the unplaced bets
      const unplacedBets = unconfirmedBets.concat(bets);
      var betsToDelete = Immutable.List();

      // Loop through the betting market ids list for bms that have been updated.
      for (let i = 0, size = bettingMarketIds.size; i < size; i++) {
        // pull the betting market id out for the current index
        let id = bettingMarketIds.get(i);
        // Filter the unplacedBets list for bets that belong to a betting market that has 
        // been updated. (Determined by bettingMarketIds).
        betsToDelete = betsToDelete.concat(
          unplacedBets.filter((bet) => bet.get('betting_market_id') === id)
        );
      }

      // Dispatch the deletion actions for the two drawers with the betsToDelete list.
      // 'unconfirmedBets' can be see in redux state under Market Drawer.
      let betIdsToDelete = betsToDelete.map((b) => b.get('id'));
      dispatch(PrivateDrawerActions.deleteManyUnconfirmedBets(betIdsToDelete));
      // 'bets' can be seen in redux state under Quick Bet Drawer.
      dispatch(PrivateDrawerActions.deleteManyBets(betsToDelete.map((b) => b.get('id'))));
      dispatch(MarketDrawerActions.updateOpenBetsLoadingStatus(LoadingStatus.DONE));
    };
  }
}

export default DrawerActions;
