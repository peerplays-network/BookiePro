import React from 'react';
import { shallow } from 'enzyme';
import { QuickBetDrawer } from './QuickBetDrawer';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { Empty } from '../Common';
import { expect } from 'chai';
import { fromJS } from 'immutable';

jest.mock('peerplaysjs-lib');

describe('<QuickBetDrawer />', () => {
  const output = 'BTC'
  const initialState = {output:10}
  const mockStore = configureStore()
  let store,wrapper


  beforeEach(()=>{
    // const initialState = {output:10}
    let initialState = Immutable.fromJS({
      // bets: Immutable.Map(),
      // overlay: BettingDrawerStates.NO_OVERLAY,
      betsToBeDeleted: Immutable.List(),
      eventInDeleteBetsConfirmation: '',
    });
    store = mockStore(initialState)
    wrapper = shallow( <Provider store={ store }><QuickBetDrawer currencyFormat={ output } /></Provider> )

  })

  test('should render a <Empty/> message if it is empty', function() {
    // expect(wrapper.find('div.empty').length).toEqual(1);
    const wrapper = shallow(<QuickBetDrawer bets={ Immutable.Map() }/>);

    expect(wrapper.find(Empty)).to.have.length(1);

  });

  test('should not render a <Empty/> message if it is not  empty', function() {
    // expect(wrapper.find('div.empty').length).toEqual(1);
    // const wrapper = shallow(<QuickBetDrawer bets={ Immutable.Map() }/>);
//     event_id(pin): "1.103.28"
// odds(pin): "6.50"
// profit(pin): undefined
// bet_type(pin): "lay"
// liability(pin): undefined
// event_name(pin): "Southern District vs Hong Kong Rangers"
// betting_market_description(pin): "Southern District"
// betting_market_group_description(pin): "Moneyline"
// stake(pin): undefined
// id(pin): 1501582174054
// team(pin): "Southern District"
// betting_market_id(pin): "1.105.163"
    expect(wrapper.find(Empty)).to.have.length(0);

  });
});
