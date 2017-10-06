import React from 'react';
import { mount } from 'enzyme';
import ComplexBettingWidget from './ComplexBettingWidget'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Complex Betting Widget', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const complexBettingWidget = mount(<ComplexBettingWidget store={ store } />);

  it('Should Exist', () => {
    expect(complexBettingWidget).toBeDefined();
  })
});
