const bitcoinSymbol = '\u0243';
const mBitcoinSymbol = 'm' + bitcoinSymbol;

var fieldPrecisionMap = {
  stake: {
    BTC: 3,
    mBTC: 0
  },
  profit : {
    BTC: 5,
    mBTC: 2
  },
  liability : {
    BTC: 5,
    mBTC: 2
  }
};

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
  // amount : float,  amount
  // precision : integer ( ***BTC*** base), either BettingModuleUtils.oddsPlaces or BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
  // currency : string, display currency, 'BTC' or 'mBTC'
  // showSymbol : boolean
  getFormattedCurrency: function( amount, currency = 'BTC', precision = 0, showSymbol = false){

    const currencySymbol = this.getCurruencySymbol(currency);

    if (currency === 'mBTC'){
      // 1 BTC = 1 * 10^3 mBTC
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

  /*
   * Format Odds, Stake, Profit and Liability based on currency and precision.
   * The precision of each field is defined in requirements.
   * Note that Odds values have no dependency on currency but it is included in
   * this function for convenience's sake.
   * This function is defined so that we don't need to do the field and precision
   * lookup in multiple places in the code.
   *
   * Parameters: 
   *   field - the name of a field (odds, stake, profit, liability)
   *   amount - a JS Number (not a string)
   *   currency - either BTC or mBTC, based on setting
   *
   * Return the field value (amount) as a formatted string
   */
  formatByCurrencyAndPrecision: function(field, amount, currency) {
    // Odds values have no dependency on currency
    if (field === 'odds') return amount.toFixed(2);
    // DO NOT expect this but just in case...
    if (!fieldPrecisionMap[field] || !fieldPrecisionMap[field][currency]) return amount;

    return this.getFormattedCurrency(amount, currency, fieldPrecisionMap[field][currency]);
  }
}

export default CurrencyUtils;
