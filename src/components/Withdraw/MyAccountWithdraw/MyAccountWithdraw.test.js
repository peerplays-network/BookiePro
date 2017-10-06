import React from 'react';
import { mount } from 'enzyme';
import MyAccountWithdraw from './MyAccountWithdraw'
import { Provider } from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The MyAccountWithdraw Component', () => {

  const store = configureStore()

  let func = jest.fn()

  const myAccountWithdraw = mount(<Provider store={ store } ><MyAccountWithdraw resetWithdrawLoadingStatus={ func }/></Provider>);

  it('Should Exist', () => {
    expect(myAccountWithdraw).toBeDefined();
  })
});
