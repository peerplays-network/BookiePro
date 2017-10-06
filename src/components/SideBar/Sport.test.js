import React from 'react';
import { mount } from 'enzyme';
import Sport from './Sport'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Sport Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const data = {
    isSelected: true
  }

  const sportComponent = mount(<Sport store={ store } data={ data } />);

  it('Should Exist', () => {
    expect(sportComponent).toBeDefined();
  })
});
