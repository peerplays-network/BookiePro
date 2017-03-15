import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class BetPrivateActions {
  static setGetOngoingBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_ONGOING_BETS_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetResolvedBetsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BET_SET_GET_RESOLVED_BETS_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class BetActions {
  static addOngoingBetsAction(ongoingBets) {
    return {
      type: ActionTypes.BET_ADD_ONGOING_BETS,
      ongoingBets
    }
  }

  static addResolvedBetsAction(resolvedBets) {
    return {
      type: ActionTypes.BET_ADD_RESOLVED_BETS,
      resolvedBets
    }
  }

  static getOngoingBets() {
    return (dispatch, getState) => {
      const account = getState().app.account;
      const accountId = account && account.get('id');

      dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getOngoingBets(accountId).then((bets) => {
        dispatch(BetPrivateActions.setGetOngoingBetsLoadingStatusAction(LoadingStatus.DONE));
        dispatch(BetActions.addOngoingBetsAction(bets));
      });

    };
  }

  static getResolvedBets(startTime, stopTime) {
    return (dispatch, getState) => {
      const account = getState().app.account;
      const accountId = account && account.get('id');

      dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getResolvedBets(accountId, startTime, stopTime).then((bets) => {
        dispatch(BetPrivateActions.setGetResolvedBetsLoadingStatusAction(LoadingStatus.DONE));
        dispatch(BetActions.addResolvedBetsAction(bets));
      });

    };
  }
}

export default BetActions;
