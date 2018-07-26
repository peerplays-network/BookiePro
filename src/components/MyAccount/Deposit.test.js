import React from 'react';
import {shallow} from 'enzyme';
import {Deposit} from './Deposit';

function setup() {
  const props = {
    depositAddress: 'aaa',
    cardClass: 'bookie-card depositCardComponent'
  };
  const depositWrapper = shallow(<Deposit { ...props } />);
  return {
    props,
    depositWrapper
  };
}

describe('Test cases on "Deposit" component', () => {
  const {depositWrapper} = setup();

  it('Check rendering of the "Deposit" component', () => {
    expect(depositWrapper.length).toEqual(1);
  });

  it('Check if "Deposit" component has class name', () => {
    expect(depositWrapper.is('.bookie-card depositCardComponent')).toBe(true);
  });

  it('Check rendering of the qrcode "QRCode" component in the "Deposit" component', () => {
    expect(depositWrapper.find('QRCode').length).toEqual(1);
  });

  it('Check if qrcode "QRCode" component has the supplied value', () => {
    const strToCompare = JSON.stringify('aaa');
    expect(depositWrapper.find('QRCode').prop('value')).toEqual(strToCompare);
  });

  it('Check rendering of the antd "Input" component in the "Deposit" component', () => {
    expect(depositWrapper.find('Input').length).toEqual(1);
  });

  it('Check if antd "Input" component has the supplied value', () => {
    expect(depositWrapper.find('Input').prop('value')).toEqual('aaa');
  });

  it('Check if antd "Input" has disabled property', () => {
    expect(depositWrapper.find('Input').prop('readOnly')).toBe(true);
  });

  it('Check rendering of html button in the "Deposit" component', () => {
    expect(depositWrapper.find('button').length).toEqual(1);
  });

  // it('Check click event of Copy button', () => {
  //
  //   /*
  //   Click event is simulated successfully here
  //   However 'copy' function of the 'copy-to-clipboard' module throws the following js error
  //   'reselectPrevious is not a function'
  //   Error reason reference link: https://github.com/nkbt/react-copy-to-clipboard/issues/20
  //   It says:
  //   'You are trying to call 'copy-to-clipboard' when there's no interaction by user 
  //   (clicks/keydowns, etc).
  //   Copy commands triggered from document.execCommand() will only affect the contents 
  //   of the real clipboard
  //   if the event is dispatched from an event that is trusted and triggered by the user,
  //   or if the implementation is configured to allow this'
  //   */
  //
  //   depositWrapper.find('button').simulate('click',{ preventDefault() {} },'aaa')
  //   /*
  //   OR another way of doing it. Use jest 'mock'
  //   const mockCallback = jest.fn();
  //   copy('bbb', mockCallback);
  //   expect(mockCallback.mock.calls.length).toBe(1);
  //   */
  // });
});
