let Normalizer = {
  normalizePassword: function(value, previousValue){

    if (!value.length) {
      return value;
    }

    if (/[^A-Za-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  },

  normalizeAccount: function(value){
    return value.toLowerCase();
  }
};

export default Normalizer;