import {BookieModes} from '../constants';


const AppUtils = {
  // Check if the running platform is windows
  isWindowsPlatform() {
    const platformName = window.navigator.platform;
    let regex = /^win/i;
    return regex.test(platformName);
  },
  // Check if the running platform is mac
  isMacPlatform() {
    const platformName = window.navigator.platform;
    let regex = /^mac/i;
    return regex.test(platformName);
  },
  // Check if the app is running inside electron
  isRunningInsideElectron() {
    return window && window.process && window.process.type === 'renderer';
  },

  getHomePath(mode) {
    let path;

    switch(mode) {
      case BookieModes.EXCHANGE:
        path = '/exchange';
        break;
      case BookieModes.SPORTSBOOK:
        path = '/sportsbook';
        break;
      default:
        path = '/exchange';
    }

    return path;
  }

};

export default AppUtils;
