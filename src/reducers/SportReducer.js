import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  sportList: []
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.SPORT_SET_LOADING_STATUS: {
      const loadingStatus = action.loadingStatus;
      return Object.assign({}, state, { loadingStatus });
    }
    case ActionTypes.SPORT_SET_SPORT_LIST: {
      const sportList = action.sportList;
      return Object.assign({}, state, { sportList });
    }
    default:
      return state;
  }
}
