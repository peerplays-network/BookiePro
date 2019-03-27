import React from 'react';

export default class SplashScreen extends React.Component {
  render () {
    return (
      <div id='content'>
        <div className='out'>
          <div className='wrapper wrapper-with-footer'>
            <div className='main'>
              <div className='yHelper active'></div>
              <section className='content'>
                <div className='box box-inPadding'>
                  <div className='dialog dialog-login dialog-loading'>
                    <div className='logo__box'>
                      <div className='logo logo-lg'>
                        <img src='images/logo-login.png' alt=''/>
                      </div>
                    </div>
                    <div className='loader-splash'>
                      <span className='loader loader-s'></span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}