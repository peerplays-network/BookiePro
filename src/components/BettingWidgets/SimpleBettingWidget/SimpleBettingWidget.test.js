import React from 'react';
import { mount } from 'enzyme';
import SimpleBettingWidget from './SimpleBettingWidget'

describe('The SimpleBettingWidget', () => {

  let store = {
    canCreateBet: false,
    showFooter: true,
    showPagination: true,
    pageSize: '200px',
    navigateTo: '',
    renderOffer: jest.fn(),
    createBet: jest.fn(),
    getState: jest.fn()
  }

  const SBW = mount(<SimpleBettingWidget title='Moneyline' currencyFormat="USD" sportName='Soccer' store={ store } />);

  it ('should exist', () => {
    expect(SBW).toBeDefined()
  })
})
