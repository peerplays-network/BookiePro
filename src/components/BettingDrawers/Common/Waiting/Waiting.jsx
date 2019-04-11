import React from 'react';
import Loading from '../../../Loading';

const Waiting = () => (
  // The waiting text is just a placeholder
  <div className='waiting'>
    <div className='instructions'>
      <Loading />
    </div>
  </div>
);

export default Waiting;
