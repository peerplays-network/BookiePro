import React from 'react';
import counterpart from 'counterpart';
import utils from 'common/utils';
import assetUtils from 'common/asset_utils';

class TranslateHtml extends React.Component {
  render() {
    let {string, params, keys} = this.props;
    let text = counterpart.translate(string, params);
    let splitText = utils.get_translation_parts(text);

    keys.forEach((key) => {
      if(key.arg === 'asset') {
        key.value = assetUtils.getSymbol(key.value);
      }

      if (splitText.indexOf(key.arg)) {
        splitText[splitText.indexOf(key.arg)] = key.value;
      }
    });

    let finalText = splitText.map((text, index) => {
      return (
        <span key={ index }>{text}</span>
      );
    });

    return (
      <span>{finalText}</span>
    );
  }
}

export default TranslateHtml;