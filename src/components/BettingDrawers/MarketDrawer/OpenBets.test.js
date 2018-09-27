import React from 'react';
import {mount} from 'enzyme';
import OpenBets from './OpenBets';
import {Provider} from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The Open Bets Component', () => {
  const store = configureStore();

  const openBets = mount(
    <Provider store={ store }>
      <OpenBets />
    </Provider>
  );

  it('Should Exist', () => {
    expect(openBets).toBeDefined();
  });
});
