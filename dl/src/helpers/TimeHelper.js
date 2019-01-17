class TimeHelper {
  static timeStringToDate(time_string) {
    if (!time_string) {
      return new Date('1970-01-01T00:00:00.000Z');
    }

    if (!/Z$/.test(time_string)) {
      //does not end in Z
    // https://github.com/cryptonomex/graphene/issues/368
      time_string = time_string + 'Z';
    }

    return new Date(time_string);
  }
}

export default TimeHelper;