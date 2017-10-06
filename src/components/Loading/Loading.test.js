import React from 'react';
import { mount } from 'enzyme';
import Loading from './Loading'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Floating Help Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const loadingComponent = mount(<Loading store={ store } />);

  it('Should Exist', () => {
    expect(loadingComponent).toBeDefined();
  })
});
