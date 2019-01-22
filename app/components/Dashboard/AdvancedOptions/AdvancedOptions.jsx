import React from 'react';
import {Link} from 'react-router';

class AdvancedOptions extends React.Component {
  render() {
    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            <div className='content__head'>
              <h1 className='content__headTitle'>Advanced Options</h1>
            </div>
            <div className='db__optionsWrap'>
              <ul className='db__optionsList'>
                <li className='db__optionsItem'>
                  <Link to='explore/voting' className='db__optionsLink'>
                    <img src='images/option/option_voting.png' alt='' className='db__optionsPic'/>
                    <span className='db__optionsTitle'>
                      Shareholder
                      <br/>Voting
                    </span>
                  </Link>
                </li>
                <li className='db__optionsItem'>
                  <Link to='/explore/blockchain' className='db__optionsLink'>
                    <img
                      src='images/option/option_blockchain.png'
                      alt=''
                      className='db__optionsPic'
                    />
                    <span className='db__optionsTitle'>
                      The Blockchain
                    </span>
                  </Link>
                </li>
                <li className='db__optionsItem'>
                  <Link to='/explore' className='db__optionsLink'>
                    <img src='images/option/option_asset.png' alt='' className='db__optionsPic'/>
                    <span className='db__optionsTitle'>
                      Advanced
                      <br/>Asset Options
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default AdvancedOptions;
