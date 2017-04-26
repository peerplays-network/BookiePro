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
  }
}

export default AppUtils;
