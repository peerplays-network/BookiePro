import React from 'react';
import {mount} from 'enzyme';
import PlacedBets from './PlacedBets';
import {Provider} from 'react-redux';
import configureStore from '../../../store/configureStore';

describe('The Placed Bets Component', () => {
  const store = configureStore();

  const placedBets = mount(
    <Provider store={ store }>
      <PlacedBets />
    </Provider>
  );

  it('Should Exist', () => {
    expect(placedBets).toBeDefined();
  });
});
