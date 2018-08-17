import React from 'react';
import Loading from '../../../Loading';

const Waiting = () => (
  // TODO: Replace this with an approved spinning icon.
  // The waiting text is just a placeholder
  <div className='waiting'>
    <div className='instructions'>
      <Loading />
    </div>
  </div>
);

export default Waiting;
