import React from 'react';
import { shallow } from 'enzyme';
import { Deposit } from './Deposit'

describe('Test cases on "Deposit" component',()=>{

  let depositWrapper
  //need to get this dynamically
  const depositAddress = '2423432432';

  const cardClass = 'bookie-card depositCardComponent'

  beforeEach(()=>{
    depositWrapper = shallow(<Deposit depositAddress={ depositAddress } cardClass={ cardClass }/>)
  })

  it('Check rendering of the "Deposit" component', () => {
    expect(depositWrapper.length).toEqual(1)
  });

  it('Check deposit address validity', () => {
    expect(depositWrapper.find('Input').prop('value')).toEqual('43534gfd')
  });

});
