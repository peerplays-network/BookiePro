import ActionTypes from '../constants/ActionTypes';

class MemoPrivateActions {
  static setViewModalStatus(isOpen, memo) {
    return {
      type: ActionTypes.MEMO_SET_VIEW_STATUS,
      isOpen,
      memo
    };
  }

  static resetViewModalStatus() {
    return {
      type: ActionTypes.MEMO_RESET_VIEW_MODAL
    };
  }
}

class MemoActions {
  static setViewModalStatus(isOpen, memo) {
    return (dispatch) => {
      dispatch(MemoPrivateActions.setViewModalStatus(isOpen, memo));
    };
  }

  static resetViewModalStatus() {
    return (dispatch) => {
      dispatch(MemoPrivateActions.resetViewModalStatus());
    };
  }
}

export default MemoActions;