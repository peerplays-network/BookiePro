/**
* The SoftwareUpdateutils contains all the functions related to software update/ application update
*
* version format is expected to be "a.b.c" in which
* 'a' represents major number - hard update indicator
* 'b' represents minor number - soft update indicator provided that major number is the same during comparsion
*/
import { Config } from '../constants';
import moment from 'moment';

const SoftwareUpdateUtils = {

  /**
  * check if version string is in valid format. I.e. "a.b.c"
  *
  * @param {string} version - expected to be in a.b.c format
  * @returns {boolean} - if the string is in valid format.
  */
  isValidVersionNumber: (version) => {
    const regex = /^(\d+\.)(\d+\.)(\d+.*)$/;
    return regex.test(version);
  },

  /**
  * check if hard update action is necessary based on version string is in valid format. I.e. "a.b.c"
  * first item ("a") in splitted array [ a,b,c], from version string, represents major number.
  *
  * if the major number in current version is smaller than that in new version,
  * action for hard update is needed.
  *
  * @param {string} newVersion - expected to be in a.b.c format
  * @returns {boolean} - if hard update is needed.
  */
  isNeedHardUpdate: (newVersion) => {
    const newVersionMajorNumber =  newVersion.split('.')[0];
    const currentVersionMajorNumber = Config.version.split('.')[0];

    const newVersionMinorNumber =  newVersion.split('.')[1];
    const currentVersionMinorNumber = Config.version.split('.')[1];

    return (newVersionMajorNumber > currentVersionMajorNumber ||
            newVersionMinorNumber > currentVersionMinorNumber);
  },

  /**
  * check if soft update action is necessary based on version string is in valid format. I.e. "a.b.c"
  * second item ("b") in splitted array [ a,b,c], from version string, represents minor number.
  *
  * if the minor number in current version is smaller than that in new version, and if both version strings have the same major number,
  * actio for soft update is needed.
  *
  * @param {string} newVersion - expected to be in a.b.c format
  * @returns {boolean} - if hard update is needed.
  */
  isNeedSoftUpdate: (newVersion) => {
    const newVersionSplitted =  newVersion.split('.');
    const currentVersionSplitted = Config.version.split('.');

    const newVersionMajorNumber =  newVersionSplitted[0];
    const currentVersionMajorNumber = currentVersionSplitted[0];

    const newVersionMinorNumber =  newVersionSplitted[1];
    const currentVersionMinorNumber = currentVersionSplitted[1];

    const newVersionPatchNumber = newVersionSplitted[2];
    const currentVersionPatchNumber = currentVersionSplitted[2];

    return (newVersionMajorNumber === currentVersionMajorNumber &&
      newVersionMinorNumber === currentVersionMinorNumber && newVersionPatchNumber > currentVersionPatchNumber);
  },

  checkHardUpdateGracePeriod: (updateDate, gracePeriod)  => {
    let now = moment();
    let updateTime = moment.unix(updateDate);
    let difference = moment.duration(now.diff(updateTime)).asSeconds();
    // Close the application if the user is outside the hard update grace period
    return difference > gracePeriod;
  }
}

export default SoftwareUpdateUtils;
