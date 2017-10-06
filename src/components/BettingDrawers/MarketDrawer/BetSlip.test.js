import React from 'react';
import { mount } from 'enzyme';
import BetSlip from './BetSlip'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Quick Bet Drawer', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const betSlip = mount(<BetSlip store={ store } />);

  it('Should Exist', () => {
    expect(betSlip).toBeDefined();
  })
});
