import { BetTypes } from '../constants';

const oddsPlaces = 2;
const stakePlaces = 3; //minimum stake = 0.001 BTC
const exposurePlaces = oddsPlaces + stakePlaces;

var BettingModule = {

  //Appendix I – Summary of Formulas

  // Profit = Stake * (Odds – 1)
  // Liability = Backer's Stake * (Odds – 1)
  getProfitOrLiability: function(stake, odd) {

    //check invalid input
    if ( parseFloat(odd).toFixed(oddsPlaces) < 1.01 ){
      return 0
    }
    return  ( parseFloat(stake) * ( parseFloat(odd) - 1 ) ).toFixed(exposurePlaces)
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

      // checking if input of stake is VALID
      if ( bet.get('stake') && parseFloat( bet.get('stake') ) && parseFloat( bet.get('stake') ) === 0 ){
        return;
      }

      if ( parseFloat( bet.get('profit') ) === 0 || parseFloat( bet.get('liability') ) === 0){
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

  getBookPercentage: function(){
    return 0;
  }
}

export default BettingModule;
