//http://stackoverflow.com/questions/17720394/javascript-string-to-byte-to-string
export function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

export function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}

export function hex2a(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    var v = parseInt(hex.substr(i, 2), 16);
    if (v) str += String.fromCharCode(v);
  }
  return str;
}
