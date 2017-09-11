import React from 'react';
import { shallow } from 'enzyme';
import { Notification } from './Notification'
import Immutable from 'immutable';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';

describe('Test cases on "Deposit" component',()=>{
  let NotificationWrapper, store
  const mockStore = configureStore()

  beforeEach(()=>{
    let initialState = Immutable.fromJS({
      notifications: Immutable.List()
    });
    store = mockStore(initialState)
    NotificationWrapper = shallow( <Provider store={ store }><Notification notifications={ Immutable.List() } /></Provider> )
  })

  it('Check rendering of the "Notification" component', () => {
    expect(NotificationWrapper.length).toEqual(1)
  });
});
