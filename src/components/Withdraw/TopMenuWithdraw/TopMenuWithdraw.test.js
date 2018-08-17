import React from 'react';
import {mount} from 'enzyme';
import TopMenuWithdraw from './TopMenuWithdraw';
import {Provider} from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The TopMenuWithdraw Component', () => {
  const store = configureStore();

  let func = jest.fn();

  const topMenuWithdraw = mount(
    <Provider store={ store }>
      <TopMenuWithdraw resetWithdrawLoadingStatus={ func } />
    </Provider>
  );

  it('Should Exist', () => {
    expect(topMenuWithdraw).toBeDefined();
  });
});
