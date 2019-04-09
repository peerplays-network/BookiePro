let Normalizer = {
  normalizePassword: function(value, previousValue){

    if (!value.length) {
      return value;
    }

    if (/[^A-Za-z0-9-.]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  },

  normalizeAccountLogin: function(value, previousValue){
    if (!value.length) {
      return value;
    }

    if (/[^A-Za-z0-9-.]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value.toLowerCase();
  },

  normalizeAccountSignup: function(value, previousValue){
    if (!value.length) {
      return value;
    }

    if (/[^A-Za-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value.toLowerCase();
  }
};

export default Normalizer;