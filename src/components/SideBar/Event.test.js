import React from 'react';
import {mount} from 'enzyme';
import Event from './Event';
import {createStore} from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Event Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const data = {
    isSelected: true
  };

  const eventComponent = mount(<Event store={ store } data={ data } name='NFL' />);

  it('Should Exist', () => {
    expect(eventComponent).toBeDefined();
  });
});
