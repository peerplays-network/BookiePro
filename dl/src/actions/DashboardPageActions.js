import ActionTypes from '../constants/ActionTypes';
import DashboardBalancesService from '../services/DashboardBalancesService';
import Repository from '../repositories/chain/repository';

class DashboardPagePrivateActions {
  /**
   * Private Redux Action Creator (DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS)
   * @param showHiddenAssets boolean
   * @returns {{type: (DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS), payload: {showHiddenAssets: boolean}}}
   */
  static toggleShowHiddenAssetsAction(showHiddenAssets) {
    return {
      type: ActionTypes.DASHBOARD_TOGGLE_SHOW_HIDDEN_ASSETS,
      payload: {
        showHiddenAssets: showHiddenAssets
      }
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_CHANGE_SIDE)
   * Dashboard Side: Set available balances
   * @param sideData
   * @returns {{type: (DASHBOARD_CHANGE_SIDE), payload: Object}}
   */
  static setSideAction(sideData) {
    return {
      type: ActionTypes.DASHBOARD_CHANGE_SIDE,
      payload: sideData
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_SET_BALANCES)
   * @param data
   * @returns {{type: (DASHBOARD_SET_BALANCES), payload: Object}}
   */
  static setBalancesAction(data) {
    return {
      type: ActionTypes.DASHBOARD_SET_BALANCES,
      payload: data
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_UPDATE)
   * @param data
   * @returns {{type: (DASHBOARD_UPDATE), payload: Object}}
   */
  static updateAssetAction(data) {
    return {
      type: ActionTypes.DASHBOARD_UPDATE,
      payload: data
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_SET_RECENT_ACTIVITY)
   * @param data
   * @returns {{type, payload: *}}
   */
  static setRecentActivityAction(data) {
    return {
      type: ActionTypes.DASHBOARD_SET_RECENT_ACTIVITY,
      payload: data
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_SET_OPEN_ORDERS)
   * @param data
   * @returns {{type, payload: *}}
   */
  static setOpenOrdersAction(data) {
    return {
      type: ActionTypes.DASHBOARD_SET_OPEN_ORDERS,
      payload: data
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_SET_SIDE_VESTING_BALANCES)
   * Side Vesting
   * @param data
   * @returns {{type, payload: *}}
   */
  static setVestingBalancesAction(data) {
    return {
      type: ActionTypes.DASHBOARD_SET_SIDE_VESTING_BALANCES,
      payload: data
    };
  }
  
  /**
   * Private Redux Action Creator (DASHBOARD_SET_SIDE_MEMBER)
   *
   * @param data
   * @returns {{type, payload: *}}
   */
  static setMemberDataAction(data) {
    return {
      type: ActionTypes.DASHBOARD_SET_SIDE_MEMBER,
      payload: data
    };
  }
}

class DashboardPageActions {
  //TODO::
  static fetchCurrentBalance() {
    return (dispatch, getState) => {
      let currentState = getState();
      DashboardBalancesService.fetchCurrentBalance(
        currentState.app.account,
        currentState.settings.unit,
        currentState.settings.defaults.unit
      ).then(() => {
        dispatch(DashboardPageActions.updateSideData());
      });
    };
  }

  /**
 * Dashboard Update
 * @returns {Function}
 */
  static updateData() {
    return (dispatch, getState) => {
      let currentState = getState();
      dispatch(DashboardPageActions.updateSideData());
      let data = DashboardBalancesService
        .calculate(currentState.settings.unit, currentState.settings.hiddenAssets);
      dispatch(DashboardPageActions.setBalances({
        coreSymbol: data.coreSymbol,
        assetSymbol: data.assetSymbol,
        decimals: data.decimals,
        precision: data.precision,
        coreToken: data.coreToken,
        fiat: data.fiat,
        cryptoTokens: data.cryptoTokens,
        smartCoins: data.smartCoins,
        otherAssets: data.otherAssets
      }));
      let activityData = DashboardBalancesService.getRecentActivityAndOpenOrdersData();
      dispatch(DashboardPageActions.setRecentActivity({
        recentActivity: activityData.recentActivity,
        headBlockNumber: activityData.headBlockNumber,
        blockInterval: activityData.blockInterval
      }));
      dispatch(DashboardPageActions.setOpenOrders({
        openOrders: activityData.openOrders
      }));
    };
  }

  /**
 * Update Dashboard Side
 *
 * @returns {function(*, *)}
 */
  static updateSideData() {
    return (dispatch, getState) => {
      let currentState = getState();
      // Total
      let availableBalances = DashboardBalancesService
        .calculateAvailableBalances(currentState.settings.defaults.unit);

      dispatch(DashboardPageActions.setSide({
        availableBalances: availableBalances
      }));

      // Member
      Repository.getAccount(currentState.app.account).then((account) => {
        dispatch(DashboardPagePrivateActions.setMemberDataAction({
          memberAccount: account
        }));
      });

      // Vesting
      let vestingBalances = currentState.dashboardPage.vestingBalances,
        vestingAsset = currentState.dashboardPage.vestingAsset,
        vestingBalancesIds = currentState.dashboardPage.vestingBalancesIds;

      DashboardBalancesService
        .calculateVesting(currentState.app.account, vestingBalances).then((data) => {
          if (!data) {
            return null;
          }

          if (
            (vestingBalancesIds !== data.vestingBalancesIds)
          || (vestingBalances !== data.vestingBalances)
          || (vestingAsset !== data.vestingAsset)
          ) {
            dispatch(DashboardPagePrivateActions.setVestingBalancesAction({
              vestingBalancesIds: data.vestingBalancesIds,
              vestingBalances: data.vestingBalances,
              vestingAsset: data.vestingAsset
            }));
          }
        });
    };
  }

  /**
 * Dashboard Side: Set available balances
 * @param side Object
 * @returns {Function}
 */
  static setSide(side) {
    return (dispatch) => {
      dispatch(DashboardPagePrivateActions.setSideAction(side));
    };
  }

  /**
 * Dashboard Side: set vesting balances
 *
 * @param data
 * @returns {function(*)}
 */
  static setVestingBalances(data) {
    return (dispatch) => {
      dispatch(DashboardPagePrivateActions.setVestingBalancesAction(data));
    };
  }

  /**
 * Set dashboard balances
 *
 * @param {Object} data
 * @returns {Function}
 */
  static setBalances(data) {
    return (dispatch) => {
      dispatch(DashboardPagePrivateActions.setBalancesAction({
        coreToken: data.coreToken,
        fiat: data.fiat,
        cryptoTokens: data.cryptoTokens,
        smartCoins: data.smartCoins,
        otherAssets: data.otherAssets,
        history: data.history,
        coreSymbol: data.coreSymbol,
        assetSymbol: data.assetSymbol,
        decimals: data.decimals,
        precision: data.precision
      }));
    };
  }

  /**
 * Dashboard row: toggle hidden asset
 * @param id
 * @param type
 * @param hidden
 * @returns {Function}
 */
  static toggleAssetHidden(id, type, hidden) {
    return (dispatch, getState) => {
      let state = getState(),
        list = state.dashboardPage[type];

      if (list) {
        let listNext = list.update(
          list.findIndex((item) => {
            return item.get('id') === id;
          }), (item) => {
            return item.set('hidden', hidden);
          }
        );
        let updateData = {};
        updateData[type] = listNext;
        dispatch(DashboardPagePrivateActions.updateAssetAction(updateData));
      }
    };
  }

  /**
 * Dashboard row: toggle hidden asset
 * @returns {Function}
 */
  static toggleShowHiddenAssets() {
    return (dispatch, getState) => {
      let state = getState();
      dispatch(DashboardPagePrivateActions.toggleShowHiddenAssetsAction(!state.dashboardPage.showHiddenAssets));
    };
  }

  /**
 * Dashboard Recent Activity Block
 *
 * @param data
 * @returns {function(*)}
 */
  static setRecentActivity(data) {
    return (dispatch) => {
      dispatch(DashboardPagePrivateActions.setRecentActivityAction(data));
    };
  }

  /**
 * Dashboard: set Open Orders
 *
 * @param data
 * @returns {function(*)}
 */
  static setOpenOrders(data) {
    return (dispatch) => {
      dispatch(DashboardPagePrivateActions.setOpenOrdersAction(data));
    };
  }
}

export default DashboardPageActions;