import { ActionTypes, LoadingStatus, ObjectPrefix } from '../constants';
import {  CommunicationService } from '../services';
import NotificationActions from './NotificationActions';
import log from 'loglevel';
import _ from 'lodash';

/**
 * Private actions
 */
class HistoryPrivateActions {

  static setInitTransactionHistoryLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.HISTORY_SET_INIT_TRANSACTION_HISTORY_LOADING_STATUS,
      loadingStatus
    }
  }

  static setInitTransactionHistoryErrorAction(error) {
    return {
      type: ActionTypes.HISTORY_SET_INIT_TRANSACTION_HISTORY_ERROR,
      error
    }
  }

  static prependTransactionsToTheHistoryAction(accountId, transactions) {
    return {
      type: ActionTypes.HISTORY_PREPEND_TRANSACTIONS_TO_THE_HISTORY,
      accountId,
      transactions
    }
  }

  static setCheckForNewTransactionHistoryLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.HISTORY_SET_CHECK_FOR_NEW_TRANSACTION_HISTORY_LOADING_STATUS,
      loadingStatus
    }
  }

  static setCheckForNewTransactionHistoryErrorAction(error) {
    return {
      type: ActionTypes.HISTORY_SET_CHECK_FOR_NEW_TRANSACTION_HISTORY_ERROR,
      error
    }
  }


  static setGetTransactionHistoryLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_LOADING_STATUS,
      loadingStatus
    }
  }

  static setGetTransactionHistoryExportLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_LOADING_STATUS_EXPORT,
      loadingStatus
    }
  }

  static setTransactionHistoryAction(transactionHistory) {
    return {
      type: ActionTypes.HISTORY_SET_TRANSACTION_HISTORY,
      transactionHistory
    }
  }


  static setGetTransactionHistoryErrorAction(error) {
    return {
      type: ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_ERROR,
      error
    }
  }

  static setTransactionHistoryExportAction(transactionHistoryExport) {
    return {
      type: ActionTypes.HISTORY_SET_TRANSACTION_HISTORY_EXPORT,
      transactionHistoryExport
    }
  }

  static setGetTransactionHistoryExportErrorAction(error) {
    return {
      type: ActionTypes.HISTORY_SET_GET_TRANSACTION_HISTORY_ERROR_EXPORT,
      error
    }
  }

}

/**
 * Public actions
 */
class HistoryActions {
  /**
   * Init transaction history when the user logs in (fetch the history of the user to the beginning of time)
   */
  static initTransactionHistory() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        // Init history
        const latestTransactionId = getState().getIn(['history', 'transactionHistoryByAccountId', accountId, 0, 'id']);
        const stopTxHistoryId = latestTransactionId || (ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0');
        // Set loading status
        dispatch(HistoryPrivateActions.setInitTransactionHistoryLoadingStatusAction(LoadingStatus.LOADING));
        CommunicationService.fetchRecentHistory(accountId, stopTxHistoryId).then((transactions) => {
          // Prepend transaction history
          dispatch(HistoryPrivateActions.prependTransactionsToTheHistoryAction(accountId, transactions));
          // Set loading status
          dispatch(HistoryPrivateActions.setInitTransactionHistoryLoadingStatusAction(LoadingStatus.DONE));
          log.debug('Init transaction history succeed.');
        }).catch((error) => {
          // Set error
          dispatch(HistoryPrivateActions.setInitTransactionHistoryErrorAction(error));
          log.error('Init transaction history error', error);
        })

      }
    }
  }

  /**
   * Check for new transaction history and prepend it to the current list of transaction history
   */
  static checkForNewTransactionHistory() {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);
      if (accountId) {
        // Init history
        const latestTransactionId = getState().getIn(['history', 'transactionHistoryByAccountId', accountId, 0, 'id']);
        const stopTxHistoryId = latestTransactionId || (ObjectPrefix.OPERATION_HISTORY_PREFIX + '.0');
        // Set loading status
        dispatch(HistoryPrivateActions.setCheckForNewTransactionHistoryLoadingStatusAction(LoadingStatus.LOADING));
        CommunicationService.fetchRecentHistory(accountId, stopTxHistoryId).then((transactions) => {
          // Prepend transaction history
          dispatch(HistoryPrivateActions.prependTransactionsToTheHistoryAction(accountId, transactions));
          // Set loading status
          dispatch(HistoryPrivateActions.setCheckForNewTransactionHistoryLoadingStatusAction(LoadingStatus.DONE));
          // Update notification
          log.debug('Check for new transaction history succeed.');
        }).catch((error) => {
          // Set error
          dispatch(HistoryPrivateActions.setCheckForNewTransactionHistoryErrorAction(error));
          log.error('Check for transaction history error', error);
        })

      }
    }
  }


  /**
   * Get transaction history
   */
  static getTransactionHistoryGivenTimeRange(startTime, stopTime) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      dispatch(HistoryPrivateActions.setGetTransactionHistoryLoadingStatusAction(LoadingStatus.LOADING));
      CommunicationService.getTransactionHistoryGivenTimeRange(accountId, startTime, stopTime).then((transactionHistory) => {
        log.debug('Get transaction history succeed.');
        dispatch(HistoryPrivateActions.setTransactionHistoryAction(transactionHistory));
        dispatch(HistoryPrivateActions.setGetTransactionHistoryLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Get transaction history error', error);
        //Set password change error
        dispatch(HistoryPrivateActions.setGetTransactionHistoryErrorAction(error));
      });
    };
  }

  /**
   * Get transaction history for Export
   */
  static getTransactionHistoryExport(startTime, stopTime) {
    return (dispatch, getState) => {
      const accountId = getState().getIn(['account', 'account', 'id']);

      dispatch(HistoryPrivateActions.setGetTransactionHistoryExportLoadingStatusAction(LoadingStatus.LOADING));
      //Included a 3 second timeout now, just to test the various states of export
      setTimeout(function(){
        CommunicationService.getTransactionHistoryGivenTimeRange(accountId, startTime, stopTime).then((transactionHistoryExport) => {
          if(getState().getIn(['account', 'getTransactionHistoryExportLoadingStatus'])===LoadingStatus.DEFAULT)
            return;
          log.debug('Get transaction history succeed.');
          //Add notification for transaction history export
          dispatch(NotificationActions.addTransactionHistoryExportNotification());
          dispatch(HistoryPrivateActions.setTransactionHistoryExportAction(transactionHistoryExport));
          dispatch(HistoryPrivateActions.setGetTransactionHistoryExportLoadingStatusAction(LoadingStatus.DONE));
        }).catch((error) => {
          log.error('Get transaction history error', error);
          //Set password change error
          dispatch(HistoryPrivateActions.setGetTransactionHistoryExportErrorAction(error));
        });
      }, 3000);
    };
  }

  //Reset transaction history export status to default when the export is cancelled
  static resetTransactionHistoryExportLoadingStatus(){
    return HistoryPrivateActions.setGetTransactionHistoryExportLoadingStatusAction(LoadingStatus.DEFAULT);
  }

  //Clear transaction history export data after download to clean up memory
  static clearTransactionHistoryExport(){
    return HistoryPrivateActions.setTransactionHistoryExportAction();
  }
}

export default HistoryActions;
