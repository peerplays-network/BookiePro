import React from 'react';
import {mount} from 'enzyme';
import Landing from './Landing';
import {createStore} from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Floating Help Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const landingComponent = mount(<Landing store={ store } />);

  it('Should Exist', () => {
    expect(landingComponent).toBeDefined();
  });
});
