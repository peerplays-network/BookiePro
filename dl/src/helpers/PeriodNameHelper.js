class PeriodNameHelper {
  static getPeriodNameByDeltaTime(delta) {
    if (delta < 60) {
      return delta + 's';
    } else if (delta < 3600) {
      return (delta / 60) + 'm';
    } else if (delta < 86400) {
      return (delta / 3600) + 'h';
    } else if (delta < 604800) {
      return (delta / 86400) + 'd';
    } else if (delta < 2592000) {
      return (delta / 604800) + 'w';
    } else {
      return (delta / 2592000) + 'm';
    }
  }
}

export default PeriodNameHelper;