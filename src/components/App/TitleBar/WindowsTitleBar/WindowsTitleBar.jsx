import React, { PureComponent } from 'react';
import WindowsControls from './WindowsControls';
import PropTypes from 'prop-types';
import Clock from '../Clock';
import { I18n } from 'react-redux-i18n';
import { Config } from '../../../../constants';

class WindowsTitleBar extends PureComponent {

  render() {
    const {
        isConnected,
        isWindowFocused,
        onMaximizeClick,
        onMinimizeClick,
        onRestoreDownClick,
        onCloseClick,
        isMaximized,
         ...props
       } = this.props;

    return (
      <div className='windows-title-bar' { ...props } >
        <div className='title'>{ I18n.t('titleBar.title') } { Config.version }</div>
        <div className='left'>
          <Clock className='clock' />
        </div>
        <div className='right'>
          <WindowsControls
            isWindowFocused={ isWindowFocused }
            onMaximizeClick={ onMaximizeClick }
            onMinimizeClick={ onMinimizeClick }
            onRestoreDownClick={ onRestoreDownClick }
            onCloseClick={ onCloseClick }
            isMaximized={ isMaximized }
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
