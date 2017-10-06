import React from 'react';
import { mount } from 'enzyme';
import TimeRangePicker from './TimeRangePicker'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)


  const timeRangePickerComponent = mount(<TimeRangePicker store={ store } />);

  it('Should Exist', () => {
    expect(timeRangePickerComponent).toBeDefined();
  })
});
