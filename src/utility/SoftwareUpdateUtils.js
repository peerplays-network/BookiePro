import { Config } from '../constants';

const SoftwareUpdateUtils = {

  isValidVersionNumber: (version) => {
    const regex = /^(\d+\.)(\d+\.)(\d+.*)$/;
    return regex.test(version);
  },

  isNeedHardUpdate: (newVersion) => {
    const newVersionMajorNumber =  newVersion.split('.')[0];
    const currentVersionMajorNumber = Config.version.split('.')[0];

    return (newVersionMajorNumber > currentVersionMajorNumber);
  },

  isNeedSoftUpdate: (newVersion) => {
    const newVersionSplitted =  newVersion.split('.');
    const currentVersionSplitted = Config.version.split('.');

    const newVersionMajorNumber =  newVersionSplitted[0];
    const currentVersionMajorNumber = currentVersionSplitted[0];

    const newVersionMinorNumber =  newVersionSplitted[1];
    const currentVersionMinorNumber = currentVersionSplitted[1];

    return (newVersionMajorNumber === currentVersionMajorNumber &&
            newVersionMinorNumber > currentVersionMinorNumber);
  }
}

export default SoftwareUpdateUtils;
