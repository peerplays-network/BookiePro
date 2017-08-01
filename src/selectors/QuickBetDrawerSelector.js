import { createSelector } from 'reselect';
import BettingDrawerStates from '../constants/BettingDrawerStates';

const { NO_OVERLAY, SUBMIT_BETS_SUCCESS } = BettingDrawerStates;

const getOverlayState = (state) => state.getIn(['quickBetDrawer', 'overlay']);

const canAcceptBet = createSelector(
  getOverlayState,
  (state) => state === NO_OVERLAY || state === SUBMIT_BETS_SUCCESS
);

const QuickBetDrawerSelector = {
  getOverlayState,
  canAcceptBet,
}

export default QuickBetDrawerSelector;
