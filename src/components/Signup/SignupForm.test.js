import React from 'react';
import { mount } from 'enzyme';
import SignupForm from './SignupForm'
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';

describe('The Signup Form', () => {

  const store = configureStore()

  const signupFormComponent = mount(<Provider store={ store } ><SignupForm /></Provider>);

  it('Should Exist', () => {
    expect(signupFormComponent).toBeDefined();
  })
});
