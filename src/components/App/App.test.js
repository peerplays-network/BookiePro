import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import App from './App';
import configureStore from '../../store/configureStore';

describe('The App', () => {
  const store = configureStore();

  const app = mount(
    <Provider store={ store }>
      <App />
    </Provider>
  );

  it('should exist', () => {
    expect(app).toBeDefined();
  });
});
