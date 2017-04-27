import React, { Component } from 'react';
import MacTitleBar from './MacTitleBar';
import WindowsTitleBar from './WindowsTitleBar';
import { AppUtils } from '../../../utility';
import { ConnectionStatus } from '../../../constants';
import { connect } from 'react-redux';

const isWindowsPlatform = AppUtils.isWindowsPlatform();
const isRunningInsideElectron = AppUtils.isRunningInsideElectron();

// Import electron only if we are running inside electron (otherwise it will throw exception)
let electron;
if (isRunningInsideElectron) {
  electron = require('electron');
}

class TitleBar extends Component {
  constructor() {
    super();

    let isWindowFocused = true;
    if (typeof document === 'object' && typeof document.hasFocus === 'function') {
      isWindowFocused = document.hasFocus();
    }

    this.state = {
      isWindowFocused,
      isMaximized: false,
      isFullscreen: false
    };
    this.windowFocus = this.windowFocus.bind(this);
    this.windowBlur = this.windowBlur.bind(this);
    this.onResizeClick = this.onResizeClick.bind(this);
    this.onMaximizeUnmaximizeClick = this.onMaximizeUnmaximizeClick.bind(this);
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
      if (window.isMaximized()){
        window.unmaximize();
        this.setState({ isMaximized: false });
      } else {
        window.maximize();
        this.setState({ isMaximized: true });
      }
    }
  }

  onResizeClick() {
    if (electron) {
      const window = electron.remote.getCurrentWindow();
      if (window.isFullScreen()) {
        window.setFullScreen(false);
        this.setState({ isFullscreen: false });
      } else {
        window.setFullScreen(true);
        this.setState({ isFullscreen: true });
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
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.windowFocus);
      window.removeEventListener('blur', this.windowBlur);
    }
  }

  windowFocus() {
    this.setState({ isWindowFocused: true });
  };

  windowBlur() {
    this.setState({ isWindowFocused: false });
  };

  render() {

    if (isWindowsPlatform) {
      return (
        <WindowsTitleBar
          isWindowFocused={ this.state.isWindowFocused }
          onMaximizeClick={ this.onMaximizeUnmaximizeClick }
          onRestoreDownClick={ this.onMaximizeUnmaximizeClick }
          onMinimizeClick={ this.onMinimizeClick }
          onCloseClick={ this.onCloseClick }
          isMaximized={ this.state.isMaximized }
          isConnected={ this.props.isConnected }
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
          isConnected={ this.props.isConnected }
        />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isConnected: state.getIn(['app', 'connectionStatus']) === ConnectionStatus.CONNECTED
  }
}

export default connect(mapStateToProps)(TitleBar);
