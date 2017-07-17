/**
 * Credit to react desktop for this component https://github.com/gabrielbull/react-desktop
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from '../../../../../utility';
const { isDarkColor } = ColorUtils;

class Close extends PureComponent {
  static contextTypes = {
    theme: PropTypes.string,
    background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
      isActive: false
    }

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseEnter() {
    this.setState({ isHover: true });
  }
  onMouseLeave() {
    this.setState({ isHover: false });
  }
  onMouseDown() {
    this.setState({ isActive: true });
  }
  onMouseUp() {
    this.setState({ isActive: false });
  }


  render() {
    const { isWindowFocused, ...props } = this.props;

    delete props.style;

    let svgFill = '#000000';
    if (!isWindowFocused && this.context.theme !== 'dark') {
      svgFill = 'rgba(0, 0, 0, .4)';
    }

    let componentClassName = 'close';
    if (this.context.theme === 'dark' || (this.context.background && isDarkColor(this.context.background))) {
      svgFill = '#ffffff';
    }

    if (this.state.isActive) {
      svgFill = '#000000';
    } else if (this.state.isHover) {
      svgFill = '#ffffff';
    }

    return (
      <a
        className={ componentClassName }
        title='Close'
        onMouseEnter={ this.onMouseEnter }
        onMouseLeave={ this.onMouseLeave }
        onMouseDown={ this.onMouseDown }
        onMouseUp={ this.onMouseUp }
        { ...props }
      >
        <svg x='0px' y='0px' viewBox='0 0 10.2 10.2' className='icon'>
          <polygon
            fill={ svgFill }
            points='10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 '
          />
        </svg>
      </a>
    );
  }
}

export default Close;
