import React from 'react';
import { mount } from 'enzyme';
import BannerClock from './BannerClock'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Banner Clock', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const clock = mount(<BannerClock store={ store } />);

  it('Should Exist', () => {
    expect(clock).toBeDefined();
  })
});
