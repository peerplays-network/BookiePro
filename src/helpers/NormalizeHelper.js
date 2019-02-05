let Normalize = {
  normalizeAccountName: function(value, previousValue) {
    if (!value.length) {
      return value;
    }
    
    console.log('HELPER value: ', value, 'prevValue', previousValue);

    if (/[^a-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  },
  normalizePassword: function(value, previousValue) {

    if (!value.length) {
      return value;
    }

    if (/[^A-Za-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  }
};

export default Normalize;
