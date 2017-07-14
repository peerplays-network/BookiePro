/**
 * Credit to react desktop for this component https://github.com/gabrielbull/react-desktop
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from '../../../../../utility';
const { isDarkColor } = ColorUtils;

class Minimize extends PureComponent {
  static contextTypes = {
    theme: PropTypes.string,
    background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  render() {
    const { isWindowFocused, ...props } = this.props;

    delete props.style;

    let svgFill = '#000000';
    if (!isWindowFocused && this.context.theme !== 'dark') {
      svgFill = 'rgba(0, 0, 0, .4)';
    }

    let componentClassName = 'minimize';
    if (this.context.theme === 'dark' || (this.context.background && isDarkColor(this.context.background))) {
      svgFill = '#ffffff';
      componentClassName = 'minimize-dark-background';
    }

    return (
      <a
        className={ componentClassName }
        title='Minimize'
        { ...props }
      >
        <svg x='0px' y='0px' viewBox='0 0 10.2 1' className='icon'>
          <rect fill={ svgFill } width='10.2' height='1'/>
        </svg>
      </a>
    );
  }
}

export default Minimize;
