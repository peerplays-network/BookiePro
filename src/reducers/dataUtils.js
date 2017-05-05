// Take an ongoing bet and return if it is an unmatched bet
const isUnmatchedBet = bet =>
  bet.get('amount_to_bet') === bet.get('remaining_amount_to_bet')
    && bet.get('amount_to_win') === bet.get('remaining_amount_to_win')

// Take an ongoing bet and return if it is a matched bet
const isMatchedBet = bet => !isUnmatchedBet(bet)

export {
  isUnmatchedBet,
  isMatchedBet
}
