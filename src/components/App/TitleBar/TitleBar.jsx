import React, { Component } from 'react';
import MacTitleBar from './Mac';
import { AppUtils } from '../../../utility';

const isWindowsPlatform = AppUtils.isWindowsPlatform();
const isMacPlatform = AppUtils.isMacPlatform();

class TitleBar extends Component {
  constructor() {
    super();

    let isWindowFocused = true;
    if (typeof document === 'object' && typeof document.hasFocus === 'function') {
      isWindowFocused = document.hasFocus();
    }

    this.state = {
      isWindowFocused
    };
    this.windowFocus = this.windowFocus.bind(this);
    this.windowBlur = this.windowBlur.bind(this);
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
    if (isMacPlatform) {
      return (
        <MacTitleBar isWindowFocused={ this.state.isWindowFocused } />
      );
    } else if (isWindowsPlatform) {
      return null;
    } else {
      return null;
    }
  }
}

export default TitleBar;
