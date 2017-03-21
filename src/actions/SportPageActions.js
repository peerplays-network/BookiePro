import { ActionTypes } from '../constants';

class SportPageActions {
  static setSportIdAction(sportId) {
    return {
      type: ActionTypes.SPORT_PAGE_SET_SPORT_ID,
      sportId
    }
  }
}

export default SportPageActions;
