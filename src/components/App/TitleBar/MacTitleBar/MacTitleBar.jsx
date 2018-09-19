import React, {PureComponent} from 'react';
import MacControls from './MacControls';
import PropTypes from 'prop-types';
import Clock from '../Clock';
import SportsbookToggle from '../SportsbookToggle';
import {I18n} from 'react-redux-i18n';
import {Config} from '../../../../constants';

class MacTitleBar extends PureComponent {
  render() {
    const {
      isWindowFocused,
      onMaximizeClick,
      onMinimizeClick,
      onResizeClick,
      onCloseClick,
      isFullscreen,
      loggedIn,
      ...props
    } = this.props;

    return (
      <div className='mac-title-bar' { ...props }>
        <div className='title'>
          {I18n.t('titleBar.title')} {Config.version}
        </div>
        <div className='left'>
          { this.props.isLinux && (<MacControls
            isWindowFocused={ isWindowFocused }
            onMaximizeClick={ onMaximizeClick }
            onMinimizeClick={ onMinimizeClick }
            onResizeClick={ onResizeClick }
            onCloseClick={ onCloseClick }
            isFullscreen={ isFullscreen }
          />)
          }
        </div>

        {loggedIn && (
          <div className='right'>
            <SportsbookToggle />
          </div>
        )}

        {Config.features.clock && (
          <div className='right'>
            <Clock className='clock' />
          </div>
        )}
      </div>
    );
  }
}

MacTitleBar.propTypes = {
  isWindowFocused: PropTypes.bool,
  onMaximizeClick: PropTypes.func,
  onResizeClick: PropTypes.func,
  onMinimizeClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  isFullscreen: PropTypes.bool,
};

export default MacTitleBar;
