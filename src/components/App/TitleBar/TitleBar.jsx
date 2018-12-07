import React, {PureComponent} from 'react';
import MacTitleBar from './MacTitleBar';
import WindowsTitleBar from './WindowsTitleBar';
import {AppUtils} from '../../../utility';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

// Import electron only if we are running inside electron (otherwise it will throw exception)
let electron;

if (isRunningInsideElectron) {
  electron = window.require('electron');
}

class TitleBar extends PureComponent {
  constructor() {
    super();

    let isWindowFocused = true;

    if (typeof document === 'object' && typeof document.hasFocus === 'function') {
      isWindowFocused = document.hasFocus();
    }

    this.state = {
      isWindowFocused,
      isMaximized: false,
      isFullscreen: false,
    };
    this.windowFocus = this.windowFocus.bind(this);
    this.windowBlur = this.windowBlur.bind(this);
    this.windowMaximized = this.windowMaximized.bind(this);
    this.windowUnmaximized = this.windowUnmaximized.bind(this);
    this.windowEnterFullScreen = this.windowEnterFullScreen.bind(this);
    this.windowExitFullScreen = this.windowExitFullScreen.bind(this);
  }

  windowMaximized() {
    this.setState({isMaximized: true});
  }

  windowUnmaximized() {
    this.setState({isMaximized: false});
  }

  windowEnterFullScreen() {
    this.setState({isFullscreen: true});
  }

  windowExitFullScreen() {
    this.setState({isFullscreen: false});
  }

  onMinimizeClick() {
    if (electron) {
      const window = electron.remote.getCurrentWindow();
      window.minimize();
    }
  }

  onMaximizeUnmaximizeClick() {
    if (electron) {
      const window = electron.remote.getCurrentWindow();

      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  }

  onResizeClick() {
    if (electron) {
      const window = electron.remote.getCurrentWindow();

      if (window.isFullScreen()) {
        window.setFullScreen(false);
      } else {
        window.setFullScreen(true);
      }
    }
  }

  onCloseClick() {
    if (electron) {
      const window = electron.remote.getCurrentWindow();
      window.close();
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.windowFocus);
      window.addEventListener('blur', this.windowBlur);

      if (electron) {
        const electronWindow = electron.remote.getCurrentWindow();
        electronWindow.on('maximize', this.windowMaximized);
        electronWindow.on('unmaximize', this.windowUnmaximized);
        electronWindow.on('enter-full-screen', this.windowEnterFullScreen);
        electronWindow.on('leave-full-screen', this.windowExitFullScreen);
        electronWindow.on('enter-html-full-screen', this.windowEnterFullScreen);
        electronWindow.on('leave-html-full-screen', this.windowExitFullScreen);
      }
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.windowFocus);
      window.removeEventListener('blur', this.windowBlur);

      if (electron) {
        const electronWindow = electron.remote.getCurrentWindow();
        electronWindow.removeListener('maximize', this.windowMaximized);
        electronWindow.removeListener('unmaximize', this.windowUnmaximized);
        electronWindow.removeListener('enter-full-screen', this.windowEnterFullScreen);
        electronWindow.removeListener('leave-full-screen', this.windowExitFullScreen);
        electronWindow.removeListener('enter-html-full-screen', this.windowEnterFullScreen);
        electronWindow.removeListener('leave-html-full-screen', this.windowExitFullScreen);
      }
    }
  }

  windowFocus() {
    this.setState({isWindowFocused: true});
  }

  windowBlur() {
    this.setState({isWindowFocused: false});
  }

  render() {
    const {isWindowsPlatform, isTransparent, height} = this.props;

    let style = {
      height,
      minHeight: height,
    };

    if (isTransparent) {
      style['backgroundColor'] = 'transparent';
    }

    if (isWindowsPlatform) {
      return (
        <WindowsTitleBar
          isWindowFocused={ this.state.isWindowFocused }
          onMaximizeClick={ this.onMaximizeUnmaximizeClick }
          onRestoreDownClick={ this.onMaximizeUnmaximizeClick }
          onMinimizeClick={ this.onMinimizeClick }
          onCloseClick={ this.onCloseClick }
          isMaximized={ this.state.isMaximized }
          loggedIn={ this.props.loggedIn }
          style={ style }
        />
      );
    } else {
      // Instead of returning nothing when it is either not Mac or Windows, resort to Mac style
      return (
        <MacTitleBar
          isWindowFocused={ this.state.isWindowFocused }
          onMaximizeClick={ this.onMaximizeUnmaximizeClick }
          onMinimizeClick={ this.onMinimizeClick }
          onResizeClick={ this.onResizeClick }
          onCloseClick={ this.onCloseClick }
          isFullscreen={ this.state.isFullscreen }
          loggedIn={ this.props.loggedIn }
          style={ style }
        />
      );
    }
  }
}

TitleBar.propTypes = {
  isWindowsPlatform: PropTypes.bool,
  isTitleBarTransparent: PropTypes.bool,
  height: PropTypes.string,
  style: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.getIn(['account', 'isLoggedIn'])
  };
};

export default connect(mapStateToProps)(TitleBar);
