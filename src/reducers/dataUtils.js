import Immutable from 'immutable';

// Take an ongoing bet and return if it is an unmatched bet
const isUnmatchedBet = bet =>
  bet.get('amount_to_bet') === bet.get('remaining_amount_to_bet')
    && bet.get('amount_to_win') === bet.get('remaining_amount_to_win')

// Take an ongoing bet and return if it is a matched bet
const isMatchedBet = bet => !isUnmatchedBet(bet)

// Transform the source bet object into a normalized form for the app
// NOTE: Currently odds and stake are stored as number in dummy data
//       Tney are converted to String here for easier comparsion with User Input
// TODO: REVIEW this again once we have real Blockchain dasta
const transformBetObject = bet =>
  Immutable.fromJS({
    id: bet.get('id'),
    bettor_id: bet.get('bettor_id'),
    // TODO: may not need toLowerCase once we got the real data
    bet_type: bet.get('back_or_lay').toLowerCase(),
    odds: bet.get('amount_to_win').toString(),
    stake: bet.get('amount_to_bet').toString(),
    betting_market_id: bet.get('betting_market_id'),
  })

export {
  isUnmatchedBet,
  isMatchedBet,
  transformBetObject,
}
