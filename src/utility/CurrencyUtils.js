const bitcoinSymbol = '\u0243';
const mBitcoinSymbol = 'm' + bitcoinSymbol;


var CurrencyUtils = {

  //Converts the amount obtained in satoshi to the user's set currency as per the precision
  convertAmount: function(amountInSatoshi, precision, targetCurrency){
    if(amountInSatoshi !==-1){
      if(targetCurrency === 'BTC')
        return (amountInSatoshi / Math.pow(10, precision));
      if(targetCurrency === 'mBTC')
        return (amountInSatoshi / Math.pow(10, precision)) * 1000;
    } else {
      return -1;
    }
  }
}

export default CurrencyUtils;
