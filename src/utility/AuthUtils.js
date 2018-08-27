var AuthUtils = {
  normalizeAccountName: function(value, previousValue) {
    if (!value.length) {
      return value;
    }

    if (/[^a-z0-9-]/.test(value)) {
      return previousValue && previousValue.toLowerCase();
    }

    return value;
  }
};
export default AuthUtils;
