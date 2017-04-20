const oddsPlaces = 2;
const stakePlaces = 3; //minimum stake = 0.001 BTC
const profitLiabilityPlaces = oddsPlaces + stakePlaces;

var BettingModule = {

  //Appendix I – Summary of Formulas
  
  // Profit = Stake * (Odds – 1)
  // Liability = Backer's Stake * (Odds – 1)
  getProfitOrLiability: function(stake, odd) {
    return  ( parseFloat(stake) * ( parseFloat(odd) - 1 ) ).toFixed(profitLiabilityPlaces)
  }
}

export default BettingModule;
