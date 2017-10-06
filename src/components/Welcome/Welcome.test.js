import React from 'react';
import { mount } from 'enzyme';
import Welcome from './Welcome'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const welcomeComponent = mount(<Welcome store={ store } />);

  it('Should Exist', () => {
    expect(welcomeComponent).toBeDefined();
  })
});
