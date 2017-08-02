import CurrencyUtils from './CurrencyUtils';


describe('CurrencyUtils ', () => {

  test('getCurruencySymbol() ', () => {
    expect(CurrencyUtils.getCurruencySymbol()).toBe(undefined);
  });

});
