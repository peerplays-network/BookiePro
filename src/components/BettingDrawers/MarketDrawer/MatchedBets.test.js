import React from 'react';
import { mount } from 'enzyme';
import MatchedBets from './MatchedBets'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Matched Bets Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const matchedBets = mount(<MatchedBets store={ store } />);

  it('Should Exist', () => {
    expect(matchedBets).toBeDefined();
  })
});
