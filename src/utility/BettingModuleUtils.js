import { BetTypes } from '../constants';

const oddsPlaces = 2;
const stakePlaces = 3; //minimum stake = 0.001 BTC
const exposurePlaces = oddsPlaces + stakePlaces;

var isFieldInvalid = function(object, field) {
  if (!object.has(field)) return true;
  const floatValue = parseFloat(object.get(field));
  if (floatValue === 0) return true;

  return isNaN(floatValue);
}

var BettingModuleUtils = {

  //Appendix I – Summary of Formulas

  // Profit = Stake * (Odds – 1)
  // Liability = Backer's Stake * (Odds – 1)
  getProfitOrLiability: function(stake, odds) {
    const floatStake = parseFloat(stake);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatStake) || isNaN(floatOdds) ) {
      return;
    }
    if ( floatOdds.toFixed(oddsPlaces) < 1.01 ){
      return;
    }
    return  ( floatStake * ( floatOdds - 1 ) ).toFixed(exposurePlaces)
  },


  // Exposure
  //
  // Matched Exposure (Pending Change Request)
  // Case    Exposure of the selection that the bet originates from    All other selection’s exposure
  // A back bet is matched    + Profit    - Stake
  // A lay bet is matched    - Liability    + Backer’s Stake
  //
  // Betslip Exposure (Pending Change Request)
  // Case    Exposure of the selection that the bet originates from    All other selection’s exposure
  // A full back bet betslip is filled    + Profit    - Stake
  // A full lay bet betslip is filled    - Liability    + Backer’s Stake
  //
  // Parameters:
  //  bettingMarketId, String : id of the betting market for which expsoure calculation specified
  //  unconfirmedBets, Immutable.List : marketDrawer.unconfirmedBets stored in redux
  // Returns:
  //  exposure of the target betting market
  getExposure: function(bettingMarketId, bets ){
    let exposure = 0.00

    //NOTE using bet.get('stake') for stake related calculation
    bets.forEach((bet, i) => {

      // TODO: Confirm if stake should be empty or having having a zero value if it is not available
      // TODO: Confirm if profit/liability should be empty or having a zero value if it is not available
      if ( isFieldInvalid(bet, 'odds') || isFieldInvalid(bet, 'stake') ||
           isFieldInvalid(bet, 'profit') || isFieldInvalid(bet, 'liability') ) {
        return;
      }

      if (bettingMarketId === bet.get('betting_market_id')){

        //Exposure of the selection that the bet originates from
        if ( bet.get('bet_type') === BetTypes.BACK){
          // A full back bet betslip is filled --> + Profit
          exposure = parseFloat(exposure) + parseFloat( bet.get('profit') );
        } else if ( bet.get('bet_type') === BetTypes.LAY){
          // A full lay bet betslip is filled --> - Liability
          exposure = parseFloat(exposure) - parseFloat( bet.get('liability') );
        }
      } else {
        //  All other selection’s exposure
        if ( bet.get('bet_type') === BetTypes.BACK){
          // A full back bet betslip is filled --> - Stake
          exposure = parseFloat(exposure) - parseFloat( bet.get('stake') );
        } else if ( bet.get('bet_type') === BetTypes.LAY){
          // A full lay bet betslip is filled --> + Backer’s Stake
          exposure = parseFloat(exposure) + parseFloat( bet.get('stake') );
        }
      }

    });

    return exposure.toFixed(exposurePlaces);

  },

  //   Book Percentage (Pending Change Request)
  // Back Book Percentage: (100% / Best Back Odds of Selection 1) + … + (100% / Best Back Odds of Selection n)
  // Lay Book Percentage: (100% / Best Lay Odds of Selection 1) + … + (100% / Best Lay Odds of Selection n)

  // Parameters:
  // BestBackOddsPerMarket  Immutable.List : the best grouped back odds of each selection
  // Returns:
  // BackBookPercentage: the back book percentage of the market
  getBookPercentage: function( bestOfferList){
    let backBookPercent = 0.0;

    bestOfferList.forEach( (offer) => {
      backBookPercent = parseFloat(backBookPercent) + parseFloat( (100 / offer.get('odds')) );
    } )

    return Math.round(backBookPercent);
  }
}

export default BettingModuleUtils;
