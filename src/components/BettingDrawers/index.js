/**
 * Betting Drawer is where the users place and manage their bets in the Bookie
 * application. There are two types of Betting Drawer:
 *
 * The QuickBetDrawer is used in the Home (AllSports), Sport and Division (
 * EventGroup) components where more than one market are presented.
 *
 * The MarketDrawer is only applicable in the BettingMarketGroup (Market) component.
 */
import QuickBetDrawer from './QuickBetDrawer';
import MarketDrawer from './MarketDrawer';
export {QuickBetDrawer, MarketDrawer};
