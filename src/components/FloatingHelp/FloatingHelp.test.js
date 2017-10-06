import React from 'react';
import { mount } from 'enzyme';
import FloatingHelp from './FloatingHelp'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Floating Help Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const floatingHelpComponent = mount(<FloatingHelp store={ store } />);

  it('Should Exist', () => {
    expect(floatingHelpComponent).toBeDefined();
  })
});
