import React from 'react';
import Side from './Side';
import Balances from './Balances';

class BalancesContainer extends React.Component {
  render() {
    return (
      <div className='main'>
        <Side/>
        <Balances/>
      </div>
    );
  }
}
export default BalancesContainer;