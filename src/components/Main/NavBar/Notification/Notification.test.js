import React from 'react';
import {Notification} from './Notification';
import {NotificationTypes} from '../../../../constants';
import {mount} from 'enzyme';

import {reducer as formReducer} from 'redux-form/immutable';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import {I18n} from 'react-redux-i18n';

describe('Test cases on "Notification" component', () => {
  let store;
  let NotificationWrapper;
  const props = {
    onClickItem: jest.fn(),
    onClickCloseItem: jest.fn(),
    notifications: new Immutable.List()
  };
  beforeEach(() => {
    store = createStore(combineReducers({form: formReducer}));
    NotificationWrapper = mount(
      <Provider store={ store }>
        <Notification { ...props } />
      </Provider>
    );
  });

  it('Check rendering of the "Notification" component', () => {
    expect(NotificationWrapper.find('.notification-card-content').length).toEqual(1);
  });

  it('Check Empty notification message', () => {
    expect(
      NotificationWrapper.find('.message')
        .at(0)
        .text()
    ).toEqual(I18n.t('notification.empty'));
  });
});

describe('Test case for notificationItems rendered', () => {
  let store;
  let NotificationWrapper;
  const props = {
    onClickItem: jest.fn(),
    onClickCloseItem: jest.fn(),
    notifications: new Immutable.List([
      Immutable.Map({
        id: 1.001,
        type: NotificationTypes.DEPOSIT,
        content: 'Game of portland',
        date: new Date(),
        isRead: false
      }),
      Immutable.Map({
        id: 1.002,
        type: NotificationTypes.BET_RESOLVED,
        content: 'Game of Hingkong',
        date: new Date(),
        isRead: false
      })
    ])
  };
  beforeEach(() => {
    store = createStore(combineReducers({form: formReducer}));
    NotificationWrapper = mount(
      <Provider store={ store }>
        <Notification { ...props } />
      </Provider>
    );
  });

  it('Check NotificationItems rendered', () => {
    expect(NotificationWrapper.find('NotificationItem').length).toEqual(2);
  });
});
