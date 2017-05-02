const bitcoinSymbol = '\u0243';
const mBitcoinSymbol = 'm' + bitcoinSymbol;

var CurrencyUtils = {

  getCurruencySymbol: function( currency = 'BTC' ){
    if ( currency === 'mBTC'){
      return mBitcoinSymbol;
    } else if ( currency === 'BTC'){
      return bitcoinSymbol;
    } else{
      return
    }
  },

  // return formatted string to support negative bitcoin curruency values
  // amount : float,  amount with BTC as backStartingIndex
  // precision : integer, percision
  // currency : string, display currency, 'BTC' or 'mBTC'
  // showSymbol : boolean
  getFormattedCurrency: function( amount, currency = 'BTC', precision = 0, showSymbol = true){

    const currencySymbol = this.getCurruencySymbol(currency);

    if (currency === 'mBTC'){
      let mPrecision = precision -3;
      if ( mPrecision < 0 ){
        mPrecision = 0;
      }

      if ( showSymbol ){
        return ( amount >= 0 ? '' : '-') + ( showSymbol ? currencySymbol : '' ) + (1000 * Math.abs(amount) ).toFixed(mPrecision);
      } else {
        return ( 1000 * amount ).toFixed(mPrecision);
      }


    } else if (currency === 'BTC'){

      if ( showSymbol ){
        return ( amount >= 0 ? '' : '-') + ( showSymbol ? currencySymbol : '' ) + Math.abs(amount).toFixed(precision);
      } else {
        return (amount).toFixed(precision);
      }

    } else {
      return
    }

  },

}

export default CurrencyUtils;
