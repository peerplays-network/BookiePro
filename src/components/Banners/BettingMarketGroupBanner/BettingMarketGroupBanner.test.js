import React from 'react';
import { mount } from 'enzyme';
import BettingMarketGroupBanner from './BettingMarketGroupBanner'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

jest.mock('peerplaysjs-lib');

describe('The Betting Market Group Banner', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const bmg = mount(<BettingMarketGroupBanner store={ store } />);

  it('Should Exist', () => {
    expect(bmg).toBeDefined();
  })
});
