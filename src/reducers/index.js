import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import AssetReducer from './AssetReducer';
import SettingReducer from './SettingReducer';
import AppReducer from './AppReducer';
import SidebarReducer from './SidebarReducer';
import RegisterReducer from './RegisterReducer';
import LoginReducer from './LoginReducer';
import SportReducer from './SportReducer';
import EventGroupReducer from './EventGroupReducer';
import CompetitorReducer from './CompetitorReducer';
import EventReducer from './EventReducer';
import BettingMarketGroupReducer from './BettingMarketGroupReducer';
import BettingMarketReducer from './BettingMarketReducer';
import BetReducer from './BetReducer';
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


const rootReducer = combineReducers({
  app: AppReducer,
  asset: AssetReducer,
  setting: SettingReducer,
  register: RegisterReducer,
  login: LoginReducer,
  sport: SportReducer,
  eventGroup: EventGroupReducer,
  event: EventReducer,
  competitor: CompetitorReducer,
  bettingMarketGroup: BettingMarketGroupReducer,
  bettingMarket: BettingMarketReducer,
  bet: BetReducer,
  allSports: AllSportsReducer,
  sportPage: SportPageReducer,
  eventGroupPage: EventGroupPageReducer,
  bettingMarketGroupPage: BettingMarketGroupPageReducer,
  account: AccountReducer,
  notification: NotificationReducer,
  softwareUpdate: SoftwareUpdateReducer,
  sidebar: SidebarReducer,
  routing: ImmutableRouterReducer,
  form: formReducer,
  i18n: Immutablei18nReducer,
  quickBetDrawer: QuickBetDrawerReducer,
  marketDrawer: MarketDrawerReducer,
});

export default rootReducer;
