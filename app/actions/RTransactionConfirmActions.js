import ActionTypes from '../constants/ActionTypes';

class RTransactionConfirmPrivateActions {
  /**
   * Private Redux Action Creator (TRCONFIRM_BROADCASTING)
   * set: transaction in process
   * @returns {function(*)}
   */
  static broadcastingAction() {
    return (dispatch) => {
      return new Promise((resolve) => {
        dispatch({
          type: ActionTypes.TRCONFIRM_BROADCASTING
        });
        resolve();
      });
    };
  }

  /**
   * Private Redux Action Creator (TRCONFIRM_BROADCAST_SUCCESS)
   * set broadcast SUCCESS
   * @returns {function(*)}
   */
  static broadcastSuccessAction() {
    return (dispatch) => {
      return new Promise((resolve) => {
        dispatch({
          type: ActionTypes.TRCONFIRM_BROADCAST_SUCCESS
        });
        resolve();
      });
    };
  }

  /**
   * Private Redux Action Creator (TRCONFIRM_BROADCAST_ERROR)
   * set broadcast ERROR
   * @param err
   * @returns {function(*)}
   */
  static broadcastErrorAction(err) {
    return (dispatch) => {
      return new Promise((resolve) => {
        dispatch({
          type: ActionTypes.TRCONFIRM_BROADCAST_ERROR,
          payload: err
        });
        resolve();
      });
    };
  }

  /**
   * Private Redux Action Creator (TRCONFIRM_TRCONFIRMED)
   * The transaction was successful
   * @returns {function(*)}
   */
  static transactionConfirmedAction() {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.TRCONFIRM_TRCONFIRMED
      });
    };
  }
}

class RTransactionConfirmActions {
  /**
   * Redux Action Creator (TRCONFIRM_SET_TRANSACTION)
   * setTransaction for modal window
   *
   * @param name
   * @param data
   * @returns {function(*)}
   */
  static setTransaction(name, data) {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.TRCONFIRM_SET_TRANSACTION,
        payload: {
          transaction: name,
          data
        }
      });
    };
  }

  /**
   * Reduz Action (TRCONFIRM_CLEAR)
   * clear modal window
   * @returns {function(*)}
   */
  static clearTransaction() {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.TRCONFIRM_CLEAR
      });
    };
  }

  /**
   * Redux Action Creator (TRCONFIRM_PROPOSE)
   * set propose account
   * @param name
   * @returns {function(*)}
   */
  static setProposeAccount(name) {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.TRCONFIRM_PROPOSE,
        payload: name
      });
    };
  }

  /**
   * start transaction
   *
   * @param trFunc
   * @param funcArgs
   * @param funcCb
   * @returns {function(*=, *=)}
   */
  static confirmTransaction(trFunc, funcArgs, funcCb) {
    return (dispatch, getState) => {
      dispatch(RTransactionConfirmPrivateActions.broadcastingAction()).then(() => {
        dispatch(trFunc(funcArgs)).then(() => {
          //TODO::rm
          if (funcCb) {
            funcCb();
          }

          dispatch(RTransactionConfirmPrivateActions.broadcastSuccessAction()).then(() => {
            dispatch(RTransactionConfirmPrivateActions.transactionConfirmedAction());
          });
        }).catch((error) => {
          debugger;
          let stringError = 'Transaction Error';

          if (error && error.message) {
            let lines = error.message.split('\n');

            if (lines && lines.length > 1) {
              stringError = lines[1];
            } else {
              stringError = lines[0];
            }
          }

          if (getState().transactionConfirm.transaction.errorCallback) {
            getState().transactionConfirm.transaction.errorCallback();
          }

          dispatch(RTransactionConfirmPrivateActions.broadcastErrorAction(stringError));
        });
      });
    };
  }
}

export default RTransactionConfirmActions;