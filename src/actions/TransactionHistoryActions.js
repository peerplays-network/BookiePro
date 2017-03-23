import FakeApi from '../communication/FakeApi';
import { ActionTypes,LoadingStatus } from '../constants';

/**
 * Private actions
 */
class TransHistPrivateActions {
  // Generate set account action
  static setTransHistLoadingStatusAction(transHistLoadingStatus) {
    return {
      type: ActionTypes.TRANSACTION_HISTORY_LOADING_STATUS,
      transHistLoadingStatus
    }
  }
}

/**
 * Public actions
 */
class TransHistActions {

  static addTransactionHistory(transactionHistory) {
    return {
      type: ActionTypes.ADD_TRANSACTION_HISTORY,
      transactionHistory
    }
  }

  static getTransactionHistory(startDate,endDate){
    return (dispatch) => {
      dispatch(TransHistPrivateActions.setTransHistLoadingStatusAction(LoadingStatus.LOADING));
      // TODO: Replace with actual blockchain call
      FakeApi.getTransactionHistory(startDate,endDate).then((transactionHistory) => {
        dispatch(TransHistPrivateActions.setTransHistLoadingStatusAction(LoadingStatus.DONE));
        dispatch(TransHistActions.addTransactionHistory(transactionHistory));
      });
    };
  }

}

export default TransHistActions;
