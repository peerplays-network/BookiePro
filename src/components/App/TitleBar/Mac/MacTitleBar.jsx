import React, { Component } from 'react';
import Controls from './Controls';
import PropTypes from 'prop-types';
import Clock from '../Clock';

class MacTitleBar extends Component {

  render() {
    return (
      <div className='mac-title-bar'>
        <div className='title'>Bookie</div>
        <div className='left'>
          <Controls
            isWindowFocused={ this.props.isWindowFocused }
            onMaximizeClick={ this.props.onMaximizeClick }
            onMinimizeClick={ this.props.onMinimizeClick }
            onResizeClick={ this.props.onResizeClick }
            onCloseClick={ this.props.onCloseClick }
            isFullscreen={ this.props.isFullscreen }
          />
        </div>
        <div className='right'>
          <i className={ this.props.isConnected ? 'connection-status-online' : 'connection-status-offline' } />
          <Clock className='clock' />
        </div>

      </div>
    )
  }

}

MacTitleBar.propTypes = {
  isWindowFocused: PropTypes.bool,
  onMaximizeClick: PropTypes.func,
  onResizeClick: PropTypes.func,
  onMinimizeClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  isFullscreen: PropTypes.bool,
  isConnected: PropTypes.bool
};

export default MacTitleBar;
