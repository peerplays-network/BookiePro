import React from 'react';
import {mount} from 'enzyme';
import EventGroup from './EventGroup';
import {createStore} from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Event Group Component', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const data = {
    isSelected: true
  };

  const eventGroupComponent = mount(<EventGroup store={ store } data={ data } />);

  it('Should Exist', () => {
    expect(eventGroupComponent).toBeDefined();
  });
});
