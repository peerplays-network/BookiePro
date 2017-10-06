import React from 'react';
import { mount } from 'enzyme';
import SportBanner from './SportBanner'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

jest.mock('peerplaysjs-lib');

describe('The Sport Banner', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const banner = mount(<SportBanner store={ store } />);

  it('Should Exist', () => {
    expect(banner).toBeDefined();
  })
});
