/**
 * Credit to react desktop for this component https://github.com/gabrielbull/react-desktop
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ColorUtils} from '../../../../../utility';
const {isDarkColor} = ColorUtils;

class Maximize extends PureComponent {

  render() {
    const {isWindowFocused, isMaximized, ...props} = this.props;

    delete props.onMaximizeClick;
    delete props.onRestoreDownClick;
    delete props.style;

    let svgFill = '#000000';

    if (!isWindowFocused && this.context.theme !== 'dark') {
      svgFill = 'rgba(0, 0, 0, .4)';
    }

    let componentClassName = 'maximize';

    if (
      this.context.theme === 'dark' ||
      (this.context.background && isDarkColor(this.context.background))
    ) {
      svgFill = '#ffffff';
      componentClassName = 'maximize-dark-background';
    }

    let title = 'Maximize';
    let icon = (
      <svg x='0px' y='0px' viewBox='0 0 10.2 10.1' className='icon'>
        <path fill={ svgFill } d='M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z' />
      </svg>
    );
    let onClick = this.props.onMaximizeClick;

    if (isMaximized) {
      title = 'Restore Down';
      icon = (
        <svg x='0px' y='0px' viewBox='0 0 10.2 10.2' className='icon'>
          <path
            fill={ svgFill }
            d='M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z'
          />
        </svg>
      );
      onClick = this.props.onRestoreDownClick;
    }

    return (
      <a className={ componentClassName } title={ title } onClick={ onClick } { ...props }>
        {icon}
      </a>
    );
  }
}

Maximize.contextTypes = {
  theme: PropTypes.string,
  background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default Maximize;
