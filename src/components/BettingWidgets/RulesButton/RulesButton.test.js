import React from 'react';
import {mount} from 'enzyme';
import RulesButton from './RulesButton';
import {createStore} from 'redux';
import rootReducer from '../../../reducers';
import Immutable from 'immutable';

describe('The Rules Button', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState);

  const rulesButton = mount(<RulesButton store={ store } />);

  it('Should Exist', () => {
    expect(rulesButton).toBeDefined();
  });
});
