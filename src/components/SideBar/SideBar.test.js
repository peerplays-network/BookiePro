import React from 'react';
import { mount } from 'enzyme';
import SideBar from './SideBar'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Side Bar Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const data = {
    isSelected: true
  }

  const SideBarComponent = mount(<SideBar store={ store } data={ data } />);

  it('Should Exist', () => {
    expect(SideBarComponent).toBeDefined();
  })
});
