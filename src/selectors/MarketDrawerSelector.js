import {createSelector} from 'reselect';
import BettingDrawerStates from '../constants/BettingDrawerStates';

const {NO_OVERLAY, SUBMIT_BETS_SUCCESS} = BettingDrawerStates;

const getOverlayState = state => state.getIn(['marketDrawer', 'overlay']);
const getUnconfirmedBets = state => state.getIn(['marketDrawer', 'unconfirmedBets']);

const canAcceptBet = createSelector(
  getOverlayState,
  state => state === NO_OVERLAY || state === SUBMIT_BETS_SUCCESS
);

const MarketDrawerSelector = {
  getOverlayState,
  getUnconfirmedBets,
  canAcceptBet
};

export default MarketDrawerSelector;
