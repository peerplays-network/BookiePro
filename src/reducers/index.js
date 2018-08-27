import {combineReducers} from 'redux-immutable';
import {reducer as formReducer} from 'redux-form/immutable';

import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import AuthReducer from './AuthReducer';
import SidebarReducer from './SidebarReducer';
import SportReducer from './SportReducer';
import EventGroupReducer from './EventGroupReducer';
import EventReducer from './EventReducer';
import BettingMarketGroupReducer from './BettingMarketGroupReducer';
import BettingMarketReducer from './BettingMarketReducer';
import BetReducer from './BetReducer';
import BinnedOrderBookReducer from './BinnedOrderBookReducer';
import LiquidityReducer from './LiquidityReducer';
import AllSportsReducer from './AllSportsReducer';
import SportPageReducer from './SportPageReducer';
import EventGroupPageReducer from './EventGroupPageReducer';
import BettingMarketGroupPageReducer from './BettingMarketGroupPageReducer';
import AccountReducer from './AccountReducer';
import NotificationReducer from './NotificationReducer';
import SoftwareUpdateReducer from './SoftwareUpdateReducer';
import ImmutableRouterReducer from './ImmutableRouterReducer';
import Immutablei18nReducer from './Immutablei18nReducer';
import QuickBetDrawerReducer from './QuickBetDrawerReducer';
import MarketDrawerReducer from './MarketDrawerReducer';
import RawHistoryReducer from './RawHistoryReducer';
import BalanceReducer from './BalanceReducer';
import MywagerReducer from './MywagerReducer';
import MyAccountPageReducer from './MyAccountPageReducer';
import RuleReducer from './RuleReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  sport: SportReducer,
  eventGroup: EventGroupReducer,
  event: EventReducer,
  bettingMarketGroup: BettingMarketGroupReducer,
  bettingMarket: BettingMarketReducer,
  bet: BetReducer,
  binnedOrderBook: BinnedOrderBookReducer,
  liquidity: LiquidityReducer,
  allSports: AllSportsReducer,
  mywager: MywagerReducer,
  sportPage: SportPageReducer,
  eventGroupPage: EventGroupPageReducer,
  bettingMarketGroupPage: BettingMarketGroupPageReducer,
  account: AccountReducer,
  balance: BalanceReducer,
  rawHistory: RawHistoryReducer,
  notification: NotificationReducer,
  softwareUpdate: SoftwareUpdateReducer,
  sidebar: SidebarReducer,
  quickBetDrawer: QuickBetDrawerReducer,
  marketDrawer: MarketDrawerReducer,
  myAccountPage: MyAccountPageReducer,
  rule: RuleReducer,
  routing: ImmutableRouterReducer,
  form: formReducer,
  i18n: Immutablei18nReducer
});

export default rootReducer;
