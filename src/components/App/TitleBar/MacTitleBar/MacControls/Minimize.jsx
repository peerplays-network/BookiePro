/**
 * Credit to react desktop for this component https://github.com/gabrielbull/react-desktop
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Minimize extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    showIcon: PropTypes.bool
  };

  render() {
    const { isWindowFocused, showIcon, ...props } = this.props;

    delete props.isFullscreen;

    const iconStyle = {
      opacity: showIcon ? 1 : 0
    };

    return (
      <a
        className={ !isWindowFocused && !showIcon ? 'minimize-unfocused' : 'minimize' }
        { ...props }
      >
        {window && window.devicePixelRatio > 1.5 ? (
          <svg x='0px' y='0px' width='10px' height='10px' viewBox='0 0 20 20' className='icon' style={ iconStyle }>
            <rect fill='#995700' x='2.4' y='9' width='15.1' height='2'/>
          </svg>
        ) : (
          <svg x='0px' y='0px' width='10px' height='10px' viewBox='0 0 10 10' className='icon' style={ iconStyle }>
            <path fill='#995700' d='M8.048,4.001c0.163,0.012 0.318,0.054 0.459,0.137c0.325,0.191
              0.518,0.559 0.49,0.934c-0.007,0.097 -0.028,0.192 -0.062,0.283c-0.04,0.105 -0.098,0.204
              -0.171,0.29c-0.083,0.098 -0.185,0.181 -0.299,0.24c-0.131,0.069 -0.271,0.103 -0.417,0.114c-2.031,0.049
              -4.065,0.049 -6.096,0c-0.163,-0.012 -0.318,-0.054 -0.459,-0.137c-0.325,-0.191 -0.518,-0.559 -0.49,-0.934c0.007,-0.097
              0.028,-0.192 0.062,-0.283c0.04,-0.105 0.098,-0.204 0.171,-0.29c0.083,-0.098 0.185,-0.181 0.299,-0.24c0.131,-0.069
              0.271,-0.103 0.417,-0.114c2.031,-0.049 4.065,-0.049 6.096,0Z' />
          </svg>
        )}
      </a>
    );
  }
}

export default Minimize;
