import React from 'react';
import Translate from 'react-translate-component';
import Statistics from './Statistics';
import TimeChart from './TimeChart';
import TransactionChart from './TransactionChart';
import RecentBlocks from './RecentBlocks';
import ActivityBlocks from './ActivityBlocks';
import {connect} from 'react-redux';
import SLoader from '../../Loaders/SLoader';

class BlockChainContainer extends React.Component {
  render() {
    let {dataIsFetched} = this.props;

    if (!dataIsFetched) {
      return (
        <div className='main'>
          <section className='content'>
            <div className='box'>
              <SLoader/>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div
        id='blockchain'
        className='tab__deploy'
        style={ {
          display: 'block'
        } }>
        <Statistics/>
        <div className='box-inner box-inner-2'>
          <div className='clearfix'>
            <div className='col col-6 pr-10'>
              <div className='chart__wrap box-white-inside'>
                <Translate
                  component='div'
                  className='chart__title'
                  content='explore.blockchain.block_times'/>
                <TimeChart/>
              </div>
            </div>
            <div className='col col-6 pl-10'>
              <div className='chart__wrap box-white-inside'>
                <Translate
                  component='div'
                  className='chart__title'
                  content='explore.blockchain.trx_block'/>
                <TransactionChart/>
              </div>
            </div>
          </div>
          <ActivityBlocks/>
          <RecentBlocks/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataIsFetched : state.explorerBlockchainPage.dataIsFetched
  };
};

export default connect(mapStateToProps)(BlockChainContainer);
