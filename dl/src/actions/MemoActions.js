import {
  MEMO_SET_VIEW_STATUS,
  MEMO_RESET_VIEW_MODAL
} from '../constants/ActionTypes';

function setViewModalStatus(isOpen, memo) {
  return {
    type: MEMO_SET_VIEW_STATUS,
    isOpen,
    memo
  };
}

function resetViewModalStatus() {
  return {
    type: MEMO_RESET_VIEW_MODAL
  };
}

class MemoActions {
  static setViewModalStatus(isOpen, memo) {
    return (dispatch) => {
      dispatch(setViewModalStatus(isOpen, memo));
    };
  }

  static resetViewModalStatus() {
    return (dispatch) => {
      dispatch(resetViewModalStatus());
    };
  }
}

export default MemoActions;