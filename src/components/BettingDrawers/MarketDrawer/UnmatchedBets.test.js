import React from 'react';
import {mount} from 'enzyme';
import UnmatchedBets from './UnmatchedBets';
import {createStore} from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Unmatched Bets Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const betSlip = mount(<UnmatchedBets store={ store } />);

  it('Should Exist', () => {
    expect(betSlip).toBeDefined();
  });
});
