import React from 'react';
import {mount} from 'enzyme';
import PlaceBets from './PlaceBets';
import {createStore} from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Quick Bet Drawer', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const placeBets = mount(<PlaceBets store={ store } />);

  it('Should Exist', () => {
    expect(placeBets).toBeDefined();
  });
});
