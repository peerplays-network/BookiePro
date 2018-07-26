import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Close from './Close';
import Minimize from './Minimize';
import Maximize from './Maximize';

class WindowsControls extends PureComponent {

  getChildContext() {
    return {
      theme: 'light',
      background: '#000000'
    };
  }

  render() {
    return (
      <div className='windows-controls'>
        <Minimize
          onClick={ this.props.onMinimizeClick }
          isWindowFocused={ this.props.isWindowFocused }
          ref='minimize'
        />
        <Maximize
          onMaximizeClick={ this.props.onMaximizeClick }
          onRestoreDownClick={ this.props.onRestoreDownClick }
          isMaximized={ this.props.isMaximized }
          isWindowFocused={ this.props.isWindowFocused }
          ref='maximize'
        />
        <Close
          onClick={ this.props.onCloseClick }
          isWindowFocused={ this.props.isWindowFocused }
          ref='close'
        />
      </div>
    );
  }
}

WindowsControls.childContextTypes = {
  theme: PropTypes.string,
  background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

WindowsControls.propTypes = {
  onCloseClick: PropTypes.func,
  onMinimizeClick: PropTypes.func,
  onRestoreDownClick: PropTypes.func,
  onMaximizeClick: PropTypes.func,
  isMaximized: PropTypes.bool,
  isWindowFocused: PropTypes.bool
};

export default WindowsControls;
