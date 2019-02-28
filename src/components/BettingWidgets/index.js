/**
 * Betting widgets are used to display the best available odds for moneyline market.
 *
 * The SimpleBettingWidget, also known as Quick Market Betting Widget, is used in
 * AllSports (Home), Sport and EventGroup (Division) components. It can display
 * the best available odds for multiple events (each even appears in its own row).
 *
 * The ComplexBettingWidget, also known as Full Market Betting Widget, is used in
 * the BettingMarketGroup (Market) component only. It show the best available
 * odds for one event only and has a more complex (hence the name) UI design than
 * its "simple" counterpart.
 */

import ComplexBettingWidget from './ComplexBettingWidget';
import SimpleBettingWidget from './SimpleBettingWidget';
import BackingBettingWidget from './BackingBettingWidget';
import BackingWidgetContainer from './BackingWidgetContainer';
export {ComplexBettingWidget, SimpleBettingWidget, BackingBettingWidget, BackingWidgetContainer};
