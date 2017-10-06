import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import ChangePassword from './ChangePassword'
import configureStore from '../../store/configureStore';

describe('The Change Password Component', () => {

  const store = configureStore();

  const changePasswordComponent = mount(<Provider store={ store } ><ChangePassword /></Provider>);

  it ('should exist', () => {
    expect(changePasswordComponent).toBeDefined()
  })
})
