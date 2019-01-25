import LocationConstants from 'constants/LocationConstants';
import DashboardBalancesService from './DashboardBalancesService';
import DashboardPageActions from '../actions/DashboardPageActions';
import ExplorerBlockChainActions from '../actions/ExplorerBlockChainActions';
import ExploreFeeScheduleActions from '../actions/ExploreFeeScheduleActions';
import SendService from './SendService';
import SendPageActions from '../actions/SendPageActions';
import ExchangePageActions from '../actions/ExchangePageActions';
import VotingActions from '../actions/VotingActions';
import SoftwareUpdateActions from '../actions/SoftwareUpdateActions';

let ChainStore;
let ReduxStore;

/**
 * This service is used for page updates on constants from LocationConstants.js
 *
 * It's listen to ChainStore and call a updateChainStore fnc
 *
 */

function updateChainStore() {
  ReduxStore.dispatch(SoftwareUpdateActions.checkForSoftwareUpdate());
  let currentState = ReduxStore.getState();
  /**
     * New
     */

  if (currentState.app.currentLocation) {
    switch (currentState.app.currentLocation) {
      case LocationConstants.EXPLORER_BLOCK_CHAIN:
        ReduxStore.dispatch(ExplorerBlockChainActions.updateAllData());
        break;
      case LocationConstants.EXPLORER_FEE_SCHEDULE:
        ReduxStore.dispatch(ExploreFeeScheduleActions.load());
        break;
      case LocationConstants.DASHBOARD_BALANCES:
        if (currentState.app.account) {
          DashboardBalancesService.fetchCurrentBalance(
            currentState.app.account,
            currentState.settings.unit,
            currentState.settings.defaults.unit
          ).then(() => {
            ReduxStore.dispatch(DashboardPageActions.updateData());
          });
        }

        break;
      case LocationConstants.DEPOSIT_WITHDRAW:
        if(currentState.app.account) {
          DashboardBalancesService.fetchCurrentBalance(
            currentState.app.account,
            currentState.settings.unit,
            currentState.settings.defaults.unit
          ).then(() => {
            ReduxStore.dispatch(DashboardPageActions.updateSideData());
          });
        }

        break;
      case LocationConstants.SEND:
        if(currentState.app.account) {
          DashboardBalancesService.fetchCurrentBalance(
            currentState.app.account,
            currentState.settings.unit,
            currentState.settings.defaults.unit
          ).then(() => {
            ReduxStore.dispatch(DashboardPageActions.updateSideData());
          });
          SendService.fetchData(currentState.app.account).then((data) => {
            ReduxStore.dispatch(SendPageActions.update(data));
          });
        }

        break;
      case LocationConstants.EXCHANGE:
        if (currentState.app.account) {
          DashboardBalancesService.fetchCurrentBalance(
            currentState.app.account,
            currentState.settings.unit,
            currentState.settings.defaults.unit
          ).then(() => {
            let data = DashboardBalancesService.calculate(
              currentState.settings.unit, currentState.settings.hiddenAssets
            );

            if(data && data.dataBalances){
              let baseAsset = currentState.exchangePageReducer.baseAssetId;
              let quoteAsset = currentState.exchangePageReducer.quoteAssetId;
              let coreAsset = '1.3.0';

              ReduxStore.dispatch(ExchangePageActions.setBalances({
                coreAssetBalance: (coreAsset && data.dataBalances.hasOwnProperty(coreAsset))
                  ? data.dataBalances[coreAsset]
                  : null,
                baseAssetBalance: (baseAsset && data.dataBalances.hasOwnProperty(baseAsset))
                  ? data.dataBalances[baseAsset]
                  : null,
                quoteAssetBalance: (quoteAsset && data.dataBalances.hasOwnProperty(quoteAsset))
                  ? data.dataBalances[quoteAsset]
                  : null,
              }));
            }
          });
        }

        break;

      case LocationConstants.VOTING:
        if (currentState.app.account) {
          ReduxStore.dispatch(VotingActions.fetchData());
        }
    }
  }
}

export function listenChainStore(chainStore, reduxStore) {
  ChainStore = chainStore;
  ReduxStore = reduxStore;
  ChainStore.subscribe(updateChainStore);
}

export function subscribe() {}

export function unSubscribe() {}
