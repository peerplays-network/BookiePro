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
  getFormattedCurrency: function(amount, currency = 'BTC', precision = 0){
    if (!isNaN(amount)) {
      if (currency === 'mBTC') {
        // 1 BTC = 1 * 10^3 mBTC
        const mPrecision = precision < 3 ? 0 : precision - 3;
        return ( 1000 * amount ).toFixed(mPrecision);
      }

      if (currency === 'BTC') {
        return (amount).toFixed(precision);
      }
    }

    // Return the original value in string
    return amount.toString();
  },

  /*
   * Format BTC or mBTC value with the specified currency and prepend the result with currency symbol
   * Internally, this function calls getFormattedCurrency and use the same parameters except the last optional one.
   *
   * Parameters:
   *   amount - BTC or mBTC value  to be formatted. Number is expected. String value may give unpredictable results.
   *   currency - either 'BTC' or 'mBTC'
   *   precision - integer value representing the desired precision of the formatted value
   *   spaceAfterSymbol - true if a space should be added after the currency symbol in the formatted results
   *
   * Return formatted BTC or mBTC value with currency symbol prepended
   */
  formatByCurrencyAndPrecisionWithSymbol: function(amount, currency, precision = 0, spaceAfterSymbol = false) {
    const formatted = this.getFormattedCurrency(amount, currency, precision);
    const currencySymbol = this.getCurruencySymbol(currency);

    // Note: Math.abs can take a string of valid number as argument
    if (currency === 'mBTC') {
      precision = precision < 3 ? 0 : precision - 3;
    }
    return ( amount >= 0 ? '' : '-') + currencySymbol + (spaceAfterSymbol ? ' ' : '') + Math.abs(formatted).toFixed(precision);
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
  formatFieldByCurrencyAndPrecision: function(field, amount, currency) {
    // Odds values have no dependency on currency
    if (field === 'odds') return amount.toFixed(2);
    // DO NOT expect this but just in case...
    if (!fieldPrecisionMap[field] || !fieldPrecisionMap[field][currency]) return amount;

    return this.getFormattedCurrency(amount, currency, fieldPrecisionMap[field][currency]);
  }
}

export default CurrencyUtils;
