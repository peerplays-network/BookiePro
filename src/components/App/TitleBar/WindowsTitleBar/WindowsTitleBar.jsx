import React, { Component } from 'react';
import WindowsControls from './WindowsControls';
import PropTypes from 'prop-types';
import Clock from '../Clock';

class WindowsTitleBar extends Component {

  render() {
    return (
      <div className='windows-title-bar'>
        <div className='left'>
          <i className={ this.props.isConnected ? 'connection-status-online' : 'connection-status-offline' } />
          <Clock className='clock' />
        </div>
        <div className='right'>
          <WindowsControls
            isWindowFocused={ this.props.isWindowFocused }
            onMaximizeClick={ this.props.onMaximizeClick }
            onMinimizeClick={ this.props.onMinimizeClick }
            onRestoreDownClick={ this.props.onRestoreDownClick }
            onCloseClick={ this.props.onCloseClick }
            isMaximized={ this.props.isMaximized }
          />
        </div>
      </div>
    )
  }

}

WindowsTitleBar.propTypes = {
  isWindowFocused: PropTypes.bool,
  onMaximizeClick: PropTypes.func,
  onRestoreDownClick: PropTypes.func,
  onMinimizeClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  isMaximized: PropTypes.bool,
  isConnected: PropTypes.bool
};

export default WindowsTitleBar;
