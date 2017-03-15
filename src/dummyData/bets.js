const bets = [
  {
    id: '1.106.1',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.1',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.2',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.2',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.3',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '0',
    remaining_amount_to_win: '4000',
    cancelled: false
  },
  {
    id: '1.106.4',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '0',
    remaining_amount_to_win: '6000',
    cancelled: false
  },
  {
    id: '1.106.5',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '4000',
    cancelled: false
  },
  {
    id: '1.106.6',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '6000',
    cancelled: false
  },
  {
    id: '1.106.7',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.8',
    bettor_id: '1.2.44',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },

];

//TODO: add more in this list, pay attention on the relation with the account, betting_market dummy data
// also make variety of the type of bets, i.e.
// Unmatched bets -> amount_to_bet === remaining_amount_to_bet && amount_to_win === remaining_amount_to_win
// Matched bets -> remaining_amount_to_bet === 0
// Cancelled bets -> cancelled === true (and it must be an unmatched bets since matched bets can't be cancelled)

export default bets;
