import React from 'react';

const Banner = (props) => (
  <div className='sport-banner'>
      <div className='sport-name'>
        { props.sport }
      </div>
  </div>
)

export default Banner;
