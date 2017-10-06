import React from 'react';
import { mount } from 'enzyme';
import LicenseScreen from './LicenseScreen'
import { createStore } from 'redux';
import rootReducer from '../../reducers';
import Immutable from 'immutable';

jest.mock('peerplaysjs-lib');

describe('The LicenseScreen', () => {
  const initialState = Immutable.Map();
  const store = createStore(rootReducer, initialState)

  const licenseScreen = mount(<LicenseScreen store={ store } />);

  it('Should Exist', () => {
    expect(licenseScreen).toBeDefined();
  })

  it('Should have a licenseComponent element', () => {
    expect(licenseScreen.find('.licenseComponent')).toBeDefined()
  })
});
