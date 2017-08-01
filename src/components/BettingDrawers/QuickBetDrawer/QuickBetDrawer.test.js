import React from 'react';
import { shallow } from 'enzyme';
import { QuickBetDrawer } from './QuickBetDrawer';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { Empty } from '../Common';
import { expect } from 'chai';

jest.mock('peerplaysjs-lib');

describe('<QuickBetDrawer />', () => {
  const output = 'BTC'
  const initialState = {output:10}
  const mockStore = configureStore()
  let store,wrapper


  beforeEach(()=>{
    store = mockStore(initialState)
    wrapper = shallow( <Provider store={ store }><QuickBetDrawer currencyFormat={ output } bets={ Immutable.Map() }/></Provider> )

  })

  test('should render a <Empty/> message if it is empty', function() {
    // expect(wrapper.find('div.empty').length).toEqual(1);
    const wrapper = shallow(<QuickBetDrawer bets={ Immutable.Map() }/>);

    expect(wrapper.find(Empty)).to.have.length(1);

  });
});
