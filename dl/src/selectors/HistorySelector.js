import { createSelector } from 'reselect';
import { Aes } from 'peerplaysjs-lib';

const getRecentActivity = (state) => {
    return state.dashboardPage.recentActivity
};

const getMemoKey = (state) => {
    let key = decode(state.privateKey.keys.get('memo'));
    return key;
}

export const getRecentHistory = createSelector(
    [ getRecentActivity, getMemoKey ],
    (recentActivity, memoKey) => {
        return recentActivity;        
    }
);