import React from 'react';
import BetSlip from '../BetSlip';
import Banner from './Banner';
import MarketTable from '../MarketTable';

const Home = () => (
  <div id='home-wrapper'>
    <div className='left-content'>
      <Banner />
      <MarketTable />
    </div>
    <div className='right-content'>
      <BetSlip />
      <BetSlip />
      <BetSlip />
    </div>
  </div>
);

export default Home;
