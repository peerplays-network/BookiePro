import React from 'react';
import { mount } from 'enzyme';
import BettingMarketGroup from './BettingMarketGroup'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const data = {
    isSelected: true
  }

  const bettingMarketGroupComponent = mount(<BettingMarketGroup store={ store } data={ data } />);

  it('Should Exist', () => {
    expect(bettingMarketGroupComponent).toBeDefined();
  })
});
