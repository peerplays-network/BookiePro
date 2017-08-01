import { createSelector } from 'reselect';
import BettingDrawerStates from '../constants/BettingDrawerStates';

const { NO_OVERLAY, SUBMIT_BETS_SUCCESS } = BettingDrawerStates;

const getMarketDrawerOverlayState = (state) => state.getIn(['marketDrawer', 'overlay']);

const canMarketDrawerAcceptBet = createSelector(
  getMarketDrawerOverlayState,
  (state) => state === NO_OVERLAY || state === SUBMIT_BETS_SUCCESS
);

const MarketDrawerSelector = {
  getMarketDrawerOverlayState,
  canMarketDrawerAcceptBet,
};

export default MarketDrawerSelector;
