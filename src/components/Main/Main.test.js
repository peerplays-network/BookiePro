import React from 'react';
import {shallow} from 'enzyme';
import Main from './Main';

jest.mock('peerplaysjs-lib');

describe('The main app', () => {
  const mainComponent = shallow(<Main />);

  it('Should Exist', () => {
    expect(mainComponent).toBeDefined();
  });
});
