import React from 'react';
import Side from './Side';
import Balances from './Balances';
import CommonMessage from '../../CommonMessage/CommonMessage';

class BalancesContainer extends React.Component {
  render() {
    return (
      <div className='main'>
        <CommonMessage location='header'/>
        <div>
          <Side/>
          <Balances/>
        </div>
      </div>
    );
  }
}
export default BalancesContainer;