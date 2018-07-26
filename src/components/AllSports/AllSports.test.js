import React from 'react';
import {mount} from 'enzyme';
import AllSports from './AllSports';
import {Provider} from 'react-redux';
import configureStore from '../../store/configureStore';

describe('The All Sports Component', () => {
  const store = configureStore();

  const allSports = mount(
    <Provider store={ store }>
      <AllSports />
    </Provider>
  );

  it('Should Exist', () => {
    expect(allSports).toBeDefined();
  });
});
