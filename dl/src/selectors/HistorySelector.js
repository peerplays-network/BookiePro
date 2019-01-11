import {createSelector} from 'reselect';

const getRecentActivity = (state) => {
  return state.dashboardPage.recentActivity;
};

const getMemoKey = (state) => {
  let key = decode(state.privateKey.keys.get('memo')); // TODO: find/declare
  return key;
};

export const getRecentHistory = createSelector(
  [getRecentActivity, getMemoKey],
  (recentActivity, memoKey) => { // TODO: find/declare
    return recentActivity;
  }
);