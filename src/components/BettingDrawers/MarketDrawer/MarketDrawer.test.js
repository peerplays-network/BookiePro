import React from 'react';
import { mount } from 'enzyme';
import MarketDrawer from './MarketDrawer'
import { Provider } from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The Market Drawer', () => {

  const store = configureStore()

  let now = new Date()

  const drawer = mount(<Provider store={ store } ><MarketDrawer eventTime={ now } /></Provider>);

  it('Should Exist', () => {
    expect(drawer).toBeDefined();
  })
});
