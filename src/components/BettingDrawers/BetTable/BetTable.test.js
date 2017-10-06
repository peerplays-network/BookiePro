import React from 'react';
import { mount } from 'enzyme';
import BetTable from './BetTable'
import { Provider } from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The Bet Table', () => {

  // const store = configureStore()

  // @TODO - This particular component requires a data property, the object needs to be properly constructed.

  // let data = {}

  // const placedBets = mount(<Provider store={ store } ><BetTable data={ data }/></Provider>);

  it('Mock Test', () => {
    expect(1).toBe(1)
  })
});
