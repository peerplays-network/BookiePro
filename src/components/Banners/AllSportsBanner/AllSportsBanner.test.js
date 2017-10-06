import React from 'react';
import { mount } from 'enzyme';
import AllSportsBanner from './AllSportsBanner'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The All Sports Banner', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const banner = mount(<AllSportsBanner store={ store } />);

  it('Should Exist', () => {
    expect(banner).toBeDefined();
  })
});
