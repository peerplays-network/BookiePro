/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import { combineReducers } from 'redux';
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
import { reducer as formReducer } from 'redux-form';


const rootReducer = combineReducers({
    routing: routerReducer,
    account: AccountReducer,
    voting: VotingReducer,
    claimBtsReducer: ClaimBtsReducer,
    settings: SettingsReducer,
    pageSettings: PageSettingsReducer,
    wallet: WalletReducer,
    walletData: WalletDataReducer,
    privateKey : PrivateKeyReducer,
    addressIndex : AddressIndexReducer,
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