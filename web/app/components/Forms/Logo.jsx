import React from 'react';

class Logo extends React.Component {
  render() {
    return (
      <div className='logo__box'>
        <a href='' className='logo logo-lg'> {/* eslint-disable-line */}
          <img src='images/logo-login.png' alt=''/>
        </a>
      </div>
    );
  }
}

export default Logo;