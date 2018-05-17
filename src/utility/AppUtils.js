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
  // Open a link in a browser from Bookie
  openExternalLink(link){
    if(this.isRunningInsideElectron){
      let electron = window.require('electron');
      electron.shell.openExternal(link);
    }
  }
}

export default AppUtils;
