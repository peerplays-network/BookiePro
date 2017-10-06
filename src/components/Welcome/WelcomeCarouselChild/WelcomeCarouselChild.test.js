import React from 'react';
import { mount } from 'enzyme';
import WelcomeCarouselChild from './WelcomeCarouselChild'
import { createStore } from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const welcomeCarouselChildComponent = mount(<WelcomeCarouselChild store={ store } />);

  it('Should Exist', () => {
    expect(welcomeCarouselChildComponent).toBeDefined();
  })
});
