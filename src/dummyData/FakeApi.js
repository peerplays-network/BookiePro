import sportList from './sportList';
import eventGroups from './eventGroups';
import _ from 'lodash';

const TIMEOUT_LENGTH = 500;

class FakeApi {
  static getSportList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(sportList);
      }, TIMEOUT_LENGTH);
    });
  }

  static getEventGroups(sportId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredEventGroups = _.filter(eventGroups, (eventGroup) => {
          return eventGroup.sport_id === sportId;
        });
        resolve(filteredEventGroups);
      }, TIMEOUT_LENGTH);
    });
  }
}

export default FakeApi
