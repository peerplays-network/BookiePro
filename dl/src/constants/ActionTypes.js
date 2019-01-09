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

/**
 * Account reducer
 *
 * const ACCOUNT_SEARCH - start search account by symbol
 * const ACCOUNT_SEARCH_REQUESTED - set "In process"
 * const ACCOUNT_RESET - reset account reducer
 * const SET_CURRENT_ACCOUNT - TODO::rm -> legacy
 *
 * @type {string}
 */
export const ACCOUNT_SEARCH = 'ACCOUNT_SEARCH';
export const ACCOUNT_SEARCH_REQUESTED = 'ACCOUNT_SEARCH_REQUESTED';
export const ACCOUNT_RESET = 'ACCOUNT_RESET';
export const SET_CURRENT_ACCOUNT = 'SET_CURRENT_ACCOUNT';//TODO::rm


/*
 * Voting Page
 *
 * const VOTING_SET_DATA - Set Voting page data(Pages: proxy, witnesses, committeeMembers, proposals)
 * const VOTING_CHANGE_PROXY - Change account proxy
 * */

export const VOTING_SET_DATA = 'VOTING_SET_DATA';
export const VOTING_CHANGE_PROXY = 'VOTING_CHANGE_PROXY';
export const VOTING_SET_NEW_WITNESSES = 'VOTING_SET_NEW_WITNESSES';
export const VOTING_UPDATE_WITNESS_TAB = 'VOTING_UPDATE_WITNESS_TAB';


/**
 * Settings Claim
 *
 * const SETTINGS_CLAIM_SET_KEY_ERROR - set common key error(field Owner Key)
 * const SETTINGS_CLAIM_SET_PRIVATE_KEY - Set the key with which we will work
 * const SETTINGS_CLAIM_SET_BALANCES_DATA - set claim balances list
 * const SETTINGS_CLAIM_RESET - reset page
 * const SETTINGS_CLAIM_RESET_BALANCES - reset balances list only(without owner key)
 *
 */
export const SETTINGS_CLAIM_SET_KEY_ERROR = 'SETTINGS_CLAIM_SET_KEY_ERROR';
export const SETTINGS_CLAIM_SET_PRIVATE_KEY = 'SETTINGS_CLAIM_SET_PRIVATE_KEY';
export const SETTINGS_CLAIM_SET_BALANCES_DATA = 'SETTINGS_CLAIM_SET_BALANCES_DATA';
export const SETTINGS_CLAIM_RESET = 'SETTINGS_CLAIM_RESET';
export const SETTINGS_CLAIM_RESET_BALANCES = 'SETTINGS_CLAIM_RESET_BALANCES';

/**
 * Settings
 *
 * const INIT_SETTINGS - Set initial settings
 * const SWITCH_LOCALE - Change settings language
 * const CHANGE_SETTLE_STATUS - show|hide settles
 * const CHANGE_CHAT_STATUS - show|hide chat
 * const ADD_OWNER_KEY - add OwnerKey Permissions TODO::rm
 * const ADD_CONNECTION - add ws connection
 * const REMOVE_CONNECTION - rm ws connection
 * const CHANGE_CONNECTION - change current ws connection
 * const CHANGE_UNIT - change unit //TODO::rm
 * const CHANGE_HIDDEN_ASSETS - change hidden assets
 *
 */

export const INIT_SETTINGS = 'INIT_SETTINGS';
export const SWITCH_LOCALE = 'SWITCH_LOCALE';
export const CHANGE_SETTLE_STATUS = 'CHANGE_SETTLE_STATUS';
export const CHANGE_CHAT_STATUS = 'CHANGE_CHAT_STATUS';
export const ADD_OWNER_KEY = 'ADD_OWNER_KEY'; //TODO::rm
export const CHANGE_UNIT = 'CHANGE_UNIT'; //TODO::rm
export const CHANGE_HIDDEN_ASSETS = 'CHANGE_HIDDEN_ASSETS';


/**
 * Account Vesting
 *
 * const SET_ACCOUNT_VESTING_DATA - set balances list
 * const RESET_ACCOUNT_VESTING_DATA - reset balance list
 */

export const SET_ACCOUNT_VESTING_DATA = 'SET_ACCOUNT_VESTING_DATA';
export const RESET_ACCOUNT_VESTING_DATA = 'RESET_ACCOUNT_VESTING_DATA';

/**
 * Wallet
 *
 * const SET_LOCK_STATUS - Wallet is closed or not
 * const SET_POSITION - Show|Hide Unlock modal //TODO::rm
 * const WALLET_RESET - reset wallet data(to initial data)
 * const SHOW_WALLET_PASSWORD_WINDOW - Show|Hide Unlock modal //here we work with promises
 * const RESET_WALLET_PASSWORD_WINDOW - reset Unlock modal //here we work with promises
 *
 *
 * @type {string}
 */

export const SET_LOCK_STATUS = 'SET_LOCK_STATUS';
export const SET_POSITION = 'SET_POSITION';
export const WALLET_RESET = 'WALLET_RESET';
export const SHOW_WALLET_PASSWORD_WINDOW = 'SHOW_WALLET_PASSWORD_WINDOW';
export const RESET_WALLET_PASSWORD_WINDOW = 'RESET_WALLET_PASSWORD_WINDOW';

/**
 * Wallet Data Reducer
 *
 * const WD_UPDATE_WALLET - Update wallet data
 * const WD_SET_AES_PRIVATE - Change wallet AES
 * const WD_RESET - Reset Wallet data reducer
 * const WD_UPDATE_REVEAL_MOVES_WALLET - RPS Game: Update Reveal moves //TODO::rm when rm the RPS game module
 *
 *
 * @type {string}
 */
export const WD_UPDATE_WALLET = 'WD_UPDATE_WALLET';
export const WD_SET_AES_PRIVATE = 'WD_SET_AES_PRIVATE';
export const WD_RESET = 'WD_RESET';
export const WD_UPDATE_REVEAL_MOVES_WALLET = 'WD_UPDATE_REVEAL_MOVES_WALLET';

/**
 * Private Key Reducer
 *
 * const PRIVATE_KEY_SET - Set new Private Keys
 */
export const PRIVATE_KEY_SET = 'PRIVATE_KEY_SET';

/*
    Address index
 */
export const SET_ADDRESS_INDEXES = 'SET_ADDRESS_INDEXES';
export const SET_ADDRESS_INDEXES_PUBKEYS = 'SET_ADDRESS_INDEXES_PUBKEYS';
export const SET_ADDRESS_INDEXES_SAVING_STATUS = 'SET_ADDRESS_INDEXES_SAVING_STATUS';


/**
 * App Reducer
 *
 * const APP_LOCAL_DB_IS_INIT - iDB.init_instance() is init
 * const APP_LOCAL_DB_DATA_IS_LOAD - iDB.init_instance() is load //TODO::rm
 * const APP_CHAIN_IS_INIT - ChainStore.init() Success status
 * const APP_SET_SYNC_FAIL - ChainStore.init() fail status
 * const APP_LOGOUT - logout from app
 * const APP_LOGIN - login in app
 * const APP_CURRENT_LOCATION - set current location from PageConstants.js file
 * const APP_SET_STATUS - global app status "reconnect"|null
 * const APP_SET_SHOW_CANT_CONNECT_MODAL - Show cant connect modal window or no
 */

export const APP_LOCAL_DB_IS_INIT = 'APP_LOCAL_DB_IS_INIT';
export const APP_LOCAL_DB_DATA_IS_LOAD = 'APP_LOCAL_DB_DATA_IS_LOAD';
export const APP_CHAIN_IS_INIT = 'APP_CHAIN_IS_INIT';
export const APP_SET_SYNC_FAIL = 'APP_SET_SYNC_FAIL';
export const APP_LOGOUT = 'APP_LOGOUT';
export const APP_LOGIN = 'APP_LOGIN';
export const APP_CURRENT_LOCATION = 'APP_CURRENT_LOCATION';
export const APP_SET_STATUS = 'APP_SET_STATUS';
export const APP_SET_SHOW_CANT_CONNECT_MODAL = 'APP_SET_SHOW_CANT_CONNECT_MODAL';

/**
 * Dashboard Reducer
 *
 * const DASHBOARD_CHANGE_SIDE - Dashboard Side: Set available balances
 * const DASHBOARD_SET_BALANCES - set data for balances
 * const DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS - Show hidden assets button status
 * const DASHBOARD_SET_RECENT_ACTIVITY - Set recent activity page data
 * const DASHBOARD_SET_OPEN_ORDERS -  Set open orders list
 * const DASHBOARD_SET_SIDE_VESTING_BALANCES - Dashboard Side: set vesting balances
 * const DASHBOARD_SET_SIDE_MEMBER - Dashboard Side: set controlled member account. For this account we control the change of type
 */
export const DASHBOARD_CHANGE_SIDE = 'DASHBOARD_CHANGE_SIDE';
export const DASHBOARD_SET_BALANCES = 'DASHBOARD_SET_BALANCES';
export const DASHBOARD_UPDATE = 'DASHBOARD_UPDATE';
export const DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS = 'DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS';
export const DASHBOARD_SET_RECENT_ACTIVITY = 'DASHBOARD_SET_RECENT_ACTIVITY';
export const DASHBOARD_SET_OPEN_ORDERS = 'DASHBOARD_SET_OPEN_ORDERS';
export const DASHBOARD_SET_SIDE_VESTING_BALANCES = 'DASHBOARD_SET_SIDE_VESTING_BALANCES';
export const DASHBOARD_SET_SIDE_MEMBER = 'DASHBOARD_SET_SIDE_MEMBER';


/**
 * Explorer BlockChain (ExplorerBlockchainPageReducer);
 *
 * const EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC - Set statistic page block
 * const EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS - Set recent blocks on explore page
 * const EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS - Set operation list
 * const EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED - At least once the data were collected
 * const EXPLORER_FEE_SCHEDULE_SET - blockchain/fee page: set fee groups
 *
 */

export const EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC = 'EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC';
export const EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS = 'EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS';
export const EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS = 'EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS';
export const EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED = 'EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED';
export const EXPLORER_FEE_SCHEDULE_SET = 'EXPLORER_FEE_SCHEDULE_SET';


/**
 * Send page reducer
 *
 * const SEND_PAGE_UPDATE - set all page data
 * const SEND_PAGE_SET_SYMBOL - select asset event type
 *
 */

export const SEND_PAGE_UPDATE = 'SEND_PAGE_UPDATE';
export const SEND_PAGE_SET_SYMBOL = 'SEND_PAGE_SET_SYMBOL';

/**
 * Exchange
 * was turn off
 * TODO::rm
 */

export const EXCHANGE_SET_DATA = 'EXCHANGE_SET_DATA';
export const EXCHANGE_SET_MARKETS_DATA = 'EXCHANGE_SET_MARKETS_DATA';
export const EXCHANGE_SET_MARKETS_TAB = 'EXCHANGE_SET_MARKETS_TAB';
export const EXCHANGE_SET_MARKETS_ROWS = 'EXCHANGE_SET_MARKETS_ROWS';
export const EXCHANGE_SET_MARKETS_ROWS_SORT = 'EXCHANGE_SET_MARKETS_ROWS_SORT';
export const EXCHANGE_SET_MARKETS_ROWS_LOADER = 'EXCHANGE_SET_MARKETS_ROWS_LOADER';
export const EXCHANGE_SET_PRICE_CHART = 'EXCHANGE_SET_PRICE_CHART';
export const EXCHANGE_SET_PRICE_CHART_DATA = 'EXCHANGE_SET_PRICE_CHART_DATA';
export const EXCHANGE_SET_PRICE_CHART_PERIOD = 'EXCHANGE_SET_PRICE_CHART_PERIOD';
export const EXCHANGE_SET_CURRENT_ASSETS_DATA = 'EXCHANGE_SET_CURRENT_ASSETS_DATA';
export const EXCHANGE_CHANGE_PRICE_CHART_BUCKET = 'EXCHANGE_CHANGE_PRICE_CHART_BUCKET';
export const EXCHANGE_CHANGE_PRICE_CHART_BUCKETS = 'EXCHANGE_CHANGE_PRICE_CHART_BUCKETS';
export const EXCHANGE_CHANGE_PRICE_CHART_LOADER = 'EXCHANGE_CHANGE_PRICE_CHART_LOADER';
export const EXCHANGE_SET_DEPTH_CHART_DATA = 'EXCHANGE_SET_DEPTH_CHART_DATA';
export const EXCHANGE_SET_BALANCES = 'EXCHANGE_SET_BALANCES';

/**
 * Transaction Confirm Modal
 *
 * const TRCONFIRM_SET_TRANSACTION - open modal, set transaction object, transaction type and button type
 * const TRCONFIRM_CLEAR - close and reset modal
 * const TRCONFIRM_PROPOSE - set propose btn status
 * const TRCONFIRM_TRCONFIRMED - set: The transaction was successful
 * const TRCONFIRM_BROADCASTING - set: transaction in process
 * const TRCONFIRM_BROADCAST_SUCCESS - set broadcast SUCCESS
 * const TRCONFIRM_BROADCAST_ERROR -set broadcast ERROR
 */

export const TRCONFIRM_SET_TRANSACTION = 'TRCONFIRM_SET_TRANSACTION';
export const TRCONFIRM_CLEAR = 'TRCONFIRM_CLEAR';
export const TRCONFIRM_PROPOSE = 'TRCONFIRM_PROPOSE';
export const TRCONFIRM_TRCONFIRMED = 'TRCONFIRM_TRCONFIRMED';
export const TRCONFIRM_BROADCASTING = 'TRCONFIRM_BROADCASTING';
export const TRCONFIRM_BROADCAST_SUCCESS = 'TRCONFIRM_BROADCAST_SUCCESS';
export const TRCONFIRM_BROADCAST_ERROR = 'TRCONFIRM_BROADCAST_ERROR';


/**
 * Referrals
 *
 * Referrals Page Reducer
 *
 * const REFERRALS_SET - Update controlled account
 */
export const REFERRALS_SET = 'REFERRALS_SET';

/**
 * Software Update Reducer
 *
 * const SOFTWARE_UPDATE_SET_ACCOUNT_DATA - Update controlled account
 *
 */
export const SOFTWARE_UPDATE_SET_ACCOUNT_DATA = 'SOFTWARE_UPDATE_SET_ACCOUNT_DATA';

/**
 * Notifications Reducer (Header/notices)
 *
 * const NOTIFICATIONS_SET_MESSAGES - Update notification messages
 *
 */
export const NOTIFICATIONS_SET_MESSAGES = 'NOTIFICATIONS_SET_MESSAGES';

/**
 * ClaimBts Reducer
 *
 * const CLAIM_BTS_SET_STATUS - button Status
 * const CLAIM_BTS_SET_ERRORS - ClaimBtsForm: common errors
 */
export const CLAIM_BTS_SET_STATUS = 'CLAIM_BTS_SET_STATUS';
export const CLAIM_BTS_SET_ERRORS = 'CLAIM_BTS_SET_ERRORS';


/**
 * Help Popup
 *
 * const TOGGLE_HELP_POPUP - Show|hide Help popup
 */
export const TOGGLE_HELP_POPUP = 'TOGGLE_HELP_POPUP';

/*
 * Memo Modal
 * 
 * const MEMO_SET_VIEW_STATUS - Show|hide the memo modal.
 */
export const MEMO_SET_VIEW_STATUS = 'MEMO_SET_VIEW_STATUS';
export const MEMO_RESET_VIEW_MODAL = 'MEMO_RESET_VIEW_MODAL';
