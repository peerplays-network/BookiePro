import Excel from 'excel-export';

//get a xls type based on js type
function getType(object, type) {
  if (type) {
    return type;
  }
  var objectType = typeof object;
  switch (objectType) {
    case 'string':
    case 'number':
      return objectType;
    case 'boolean':
      return 'bool';
    default:
      return 'string';
  }
}

//get a nested property from a JSON object given its key, i.e 'a.b.c'
function getByString(object, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  var property = path.split('.');
  while (property.length) {
    var key = property.shift();
    if (key in object) {
      object = (object[key] === undefined) ? null : object[key];
    } else {
      return null;
    }
  }
  return object;
}

//convert binary content to bytes
function convertStringToBytes (str) {
  var bytes = new Uint8Array(str.length);
  for (var i=0; i<str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

//prepare rows and columns from JSON
var prepareTableRowsColumnsFromJSON = function(json, config) {
  var result = {};
  var conf = config || {};
  var jsonArray = [].concat(json);
  var fields = conf.fields || Object.keys(jsonArray[0] || {});
  var types = [];
  if (!(fields instanceof Array)) {
    types = Object.keys(fields).map(function(key) {
      return fields[key];
    });
    fields = Object.keys(fields);
  }
  //cols
  result.cols = fields.map(function(key, i) {
    return {
      caption: key,
      type: getType(jsonArray[0][key], types[i]),
      beforeCellWrite: function(row, cellData, eOpt) {
        eOpt.cellType = getType(cellData, types[i]);
        return cellData;
      }
    };
  });
  //rows
  result.rows = jsonArray.map(function(row) {
    return fields.map(function(key) {
      var value = getByString(row, key);
      //stringify objects
      if (value && value.constructor === Object) value = JSON.stringify(value);
      //replace illegal xml characters with a square
      if (typeof value === 'string') {
        value = value.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, '');
      }
      return value;
    });
  });

  return result;
};

export default function(json, type, config) {
  config = config || {};
  var result = json;

  //default type excel
  switch (type) {
    case 'excel':
    default:
      var conf = prepareTableRowsColumnsFromJSON(json, config);
      //add style xml if given
      if (config.style) {
        conf.stylesXmlFile = config.style;
      }
      result = Excel.execute(conf);
      break;
  }

  if(config.toBytes){
    result = convertStringToBytes(result);
  }

  return result;
};
