/**
* The StringUtils contains all the functions related to string, byte and hexa transformation.
*
* Memo data in blockchain transaction is in bytes
*/

var Utils = {
  //http://stackoverflow.com/questions/17720394/javascript-string-to-byte-to-string
  string2Bin : function(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i));
    }
    return result;
  },

  bin2String: function(array) {
    return String.fromCharCode.apply(String, array);
  },

  //http://stackoverflow.com/questions/13697829/hexadecimal-to-string-in-javascript
  hex2a: function(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var v = parseInt(hex.substr(i, 2), 16);
      if (v) str += String.fromCharCode(v);
    }
    return str;
  },

  /**
  * Compare two software version numbers (e.g. 1.7.1)
  * Returns:
  *
  *  0 if they're identical
  *  negative if v1 < v2
  *  positive if v1 > v2
  *  Nan if they in the wrong format
  *
  *  E.g.:
  *
  *  assert(version_number_compare("1.7.1", "1.6.10") > 0);
  *  assert(version_number_compare("1.7.1", "1.7.10") < 0);
  *
  *  "Unit tests": http://jsfiddle.net/ripper234/Xv9WL/28/
  *
  *  Taken from http://stackoverflow.com/a/6832721/11236
  */
  compareVersionNumbers: function(v1, v2){
    var v1parts = v1.split('.');
    var v2parts = v2.split('.');

    // First, validate both numbers are true version numbers
    function validateParts(parts) {
      for (var i = 0; i < parts.length; ++i) {
        if (!/^\d+$/.test(parts[i])) {
          return false;
        }
      }
      return true;
    }
    if (!validateParts(v1parts) || !validateParts(v2parts)) {
      return NaN;
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1;
      }

      if (v1parts[i] === v2parts[i]) {
        continue;
      }
      if (v1parts[i] > v2parts[i]) {
        return 1;
      }
      return -1;
    }

    if (v1parts.length !== v2parts.length) {
      return -1;
    }

    return 0;
  },

  // return +(number) or +(number) based on the input number
  formatSignedNumber: function(number){
    if(number > 0){
      return ' +' + number;
    } else if ( number === 0) {
      return '';
    } else{
      return ' ' + number.toString();
    }
  }



}
export default Utils;
