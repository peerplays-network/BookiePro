//Converts the amount obtained in satoshi to the user's set currency as per the precision
export function convertAmount(amountInSatoshi, precision, targetCurrency){
  if(amountInSatoshi !==-1){
    if(targetCurrency === 'BTC')
      return (amountInSatoshi / Math.pow(10, precision));
    if(targetCurrency === 'mBTC')
      return (amountInSatoshi / Math.pow(10, precision)) * 1000;
  } else {
    return -1;
  }
}
