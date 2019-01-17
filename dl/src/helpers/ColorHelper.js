class ColorHelper {
  static getExplorerTimeColor(delta) {
    let color;

    if (delta <= 5) {
      color = '#50D2C2';
    } else if (delta <= 10) {
      color = '#A0D3E8';
    } else if (delta <= 20) {
      color = '#FCAB53';
    } else {
      color = '#deb869';
    }

    return color;
  }

  static getExplorerTransactionColor(delta) {
    let color;

    if (delta <= 5) {
      color = '#50D2C2';
    } else if (delta <= 10) {
      color = '#A0D3E8';
    } else if (delta <= 20) {
      color = '#FCAB53';
    } else {
      color = '#deb869';
    }

    return color;
  }
}



export default ColorHelper;