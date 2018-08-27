import React from 'react';
import {mount} from 'enzyme';
import Export from './Export';
import {Provider} from 'react-redux';
import configureStore from '../../store/configureStore';

describe('The Export Component', () => {
  const store = configureStore();

  let now = new Date();

  const exportComponent = mount(
    <Provider store={ store }>
      <Export eventTime={ now } />
    </Provider>
  );

  it('Should Exist', () => {
    expect(exportComponent).toBeDefined();
  });
});
