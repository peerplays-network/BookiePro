import React, { Component } from 'react';
import MacControls from './MacControls';
import PropTypes from 'prop-types';
import Clock from '../Clock';
import { I18n } from 'react-redux-i18n';

class MacTitleBar extends Component {

  render() {
    const {
        isConnected,
        isWindowFocused,
        onMaximizeClick,
        onMinimizeClick,
        onResizeClick,
        onCloseClick,
        isFullscreen,
         ...props
       } = this.props;

    return (
      <div className='mac-title-bar' { ...props }>
        <div className='title'>{ I18n.t('titleBar.title') }</div>
        <div className='left'>
          <MacControls
            isWindowFocused={ isWindowFocused }
            onMaximizeClick={ onMaximizeClick }
            onMinimizeClick={ onMinimizeClick }
            onResizeClick={ onResizeClick }
            onCloseClick={ onCloseClick }
            isFullscreen={ isFullscreen }
          />
        </div>
        <div className='right'>
          <i className={ isConnected ? 'connection-status-online' : 'connection-status-offline' } />
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
