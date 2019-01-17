import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import AccountReducer from './AccountReducer';
import SettingsReducer from './SettingsReducer';
import PageSettingsReducer from './PageSettingsReducer';
import WalletReducer from './WalletReducer';
import WalletDataReducer from './WalletDataReducer';
import PrivateKeyReducer from './PrivateKeyReducer';
import AddressIndexReducer from './AddressIndexReducer';
import LoginPageReducer from './LoginPageReducer';
import RegisterReducer from './RegisterReducer';
import AppReducer from './AppReducer';
import SendPageReducer from './SendPageReducer';
import TransactionConfirmReducer from './TransactionConfirmReducer';
import VotingReducer from './VotingReducer';
import ClaimBtsReducer from './ClaimBtsReducer';
import DashboardPageReducer from './DashboardPageReducer';
import ExplorerBlockchainPageReducer from './ExplorerBlockchainPageReducer';
import ExploreFeeScheduleReducer from './ExploreFeeScheduleReducer';
import ExchangePageReducer from './ExchangePageReducer';
import ReferralsPageReducer from './ReferralsPageReducer';
import AccountVestingPageReducer from './AccountVestingPageReducer';
import RockPaperScissorsReducer from './Games/RockPaperScissorsReducer';
import SoftwareUpdateReducer from './SoftwareUpdateReducer';
import NotificationsReducer from './NotificationsReducer';
import HelpReducer from './HelpReducer';
import MemoReducer from './MemoReducer';
import {
  reducer as formReducer
} from 'redux-form';


const rootReducer = combineReducers({
  routing: routerReducer,
  account: AccountReducer,
  voting: VotingReducer,
  claimBtsReducer: ClaimBtsReducer,
  settings: SettingsReducer,
  pageSettings: PageSettingsReducer,
  wallet: WalletReducer,
  walletData: WalletDataReducer,
  privateKey: PrivateKeyReducer,
  addressIndex: AddressIndexReducer,
  app: AppReducer,
  loginPage: LoginPageReducer,
  register: RegisterReducer,
  dashboardPage: DashboardPageReducer,
  explorerBlockchainPage: ExplorerBlockchainPageReducer,
  exploreFeeSchedule: ExploreFeeScheduleReducer,
  sendPage: SendPageReducer,
  exchangePageReducer: ExchangePageReducer,
  transactionConfirm: TransactionConfirmReducer,
  referralsPageReducer: ReferralsPageReducer,
  accountVestingPageReducer: AccountVestingPageReducer,
  softwareUpdateReducer: SoftwareUpdateReducer,
  notificationsReducer: NotificationsReducer,
  helpReducer: HelpReducer,
  memoModal: MemoReducer,

  /**
   * Games
   */
  rockPaperScissorsReducer: RockPaperScissorsReducer,
  /**
   * Common form reducer: npm redux-form
   */
  form: formReducer
});

export default rootReducer;