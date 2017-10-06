import React from 'react';
import { mount } from 'enzyme';
import Signup from './Signup'
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';

describe('The Signup Component', () => {

  const store = configureStore()

  const signupComponent = mount(<Provider store={ store } ><Signup /></Provider>);

  it('Should Exist', () => {
    expect(signupComponent).toBeDefined();
  })
});
