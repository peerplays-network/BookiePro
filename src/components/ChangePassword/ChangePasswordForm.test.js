import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import ChangePasswordForm from './ChangePasswordForm';
import configureStore from '../../store/configureStore';

describe('The Change Password Component', () => {
  const store = configureStore();

  const changePasswordFormComponent = mount(
    <Provider store={ store }>
      <ChangePasswordForm />
    </Provider>
  );

  it('should exist', () => {
    expect(changePasswordFormComponent).toBeDefined();
  });
});
