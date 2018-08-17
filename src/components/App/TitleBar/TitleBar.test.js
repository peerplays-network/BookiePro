import React from 'react';
import {mount} from 'enzyme';
import {createStore} from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';
import TitleBar from './TitleBar';

jest.mock('peerplaysjs-lib');

describe('The Title Bar', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const titleBar = mount(<TitleBar store={ store } />);

  it('Should Exist', () => {
    expect(titleBar).toBeDefined();
  });
});
