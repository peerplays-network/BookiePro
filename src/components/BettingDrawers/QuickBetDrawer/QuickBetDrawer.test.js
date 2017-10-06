import React from 'react';
import { mount } from 'enzyme';
import QuickBetDrawer from './QuickBetDrawer'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Quick Bet Drawer', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const qbd = mount(<QuickBetDrawer store={ store } />);

  it('Should Exist', () => {
    expect(qbd).toBeDefined();
  })
});
