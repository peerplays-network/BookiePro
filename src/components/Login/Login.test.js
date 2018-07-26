import React from 'react';
import {mount} from 'enzyme';
import Login from './Login';
import {Provider} from 'react-redux';
import configureStore from '../../store/configureStore';

describe('The Login Component', () => {
  const store = configureStore();

  const loginComponent = mount(
    <Provider store={ store }>
      <Login />
    </Provider>
  );

  it('Should Exist', () => {
    expect(loginComponent).toBeDefined();
  });
});
