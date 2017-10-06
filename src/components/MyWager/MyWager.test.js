import React from 'react';
import { mount } from 'enzyme';
import MyWager from './MyWager'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const myWagerComponent = mount(<MyWager store={ store } />);

  it('Should Exist', () => {
    expect(myWagerComponent).toBeDefined();
  })
});
