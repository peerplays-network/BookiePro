import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';

class EventGroupPagePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setSportAndEventGroupAction(sportName, eventGroupName) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_TITLES,
      sportName,
      eventGroupName
    }
  }

  static setEventIdsAction(eventIds) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_EVENT_IDS,
      eventIds
    }
  }

}

class EventGroupPageActions {
  static getData(eventGroupId) {
    return (dispatch) => {
      dispatch(EventGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let eventGroup;
      FakeApi.getObjects([eventGroupId]).then((retrievedObjects) => {
        eventGroup = retrievedObjects[0];

        return FakeApi.getObjects([eventGroup.sport_id]);
      }).then((result) => {
        let sport = result[0];

        dispatch(
          EventGroupPagePrivateActions.setSportAndEventGroupAction(
            sport.name,
            eventGroup.name
          )
        );
      });
    }
  }
}

export default EventGroupPageActions;
