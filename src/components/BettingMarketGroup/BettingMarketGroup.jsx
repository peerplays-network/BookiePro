import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import ComplexBettingWidget from '../ComplexBettingWidget';
import ComplexBettingWidget2 from '../BettingWidget/ComplexBettingWidget2';
import Immutable from 'immutable';
import moment from 'moment'; // TODO: Remove later. For hardcoded data only

//////// HARDCODED DATA BEGINS //////////
const fakeData =
  Immutable.fromJS([
    {
      id: '1.999.1',
      time: moment().add(1, 'days').unix() * 1000,
      name: 'Zanarkand Abes vs Besaid Aurochs',
      offers: [
        {
          back: [{ odds: 3.85, price: 2.781 }, { odds: 2.31, price: 1.843 }],
          lay: [{ odds: 2.71, price: 1.89 }, { odds: 2.71, price: 1.89 } ]
        }
      ]
    }
  ])
///////// HARDCODED DATA ENDS  //////////

class BettingMarketGroup extends Component {
  render() {
    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner />
        {/* <ComplexBettingWidget
          title='Test Title'
          events={ fakeData }
        /> */}
        <ComplexBettingWidget2
          title='Test Title'
          events={ fakeData }
        />
      </div>
    )
  }
}

export default BettingMarketGroup;
