import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class BannerClockDigit extends PureComponent {
  render() {
    const { value, ...props } = this.props;
    return (
      <div className='banner-clock-digit' { ...props }>
        <div className='background-top'/>
        <div className='background-bottom'/>
        <div className='base'> { value } </div>
      </div>
    )
  }
}

BannerClockDigit.propTypes = {
  value: PropTypes.number
}

BannerClockDigit.defaultProps = {
  value: 0
}

export default BannerClockDigit;
