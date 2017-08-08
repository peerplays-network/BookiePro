import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PoweredByPPLogoPath from '../../assets/images/powerbypp.png';

class PeerPlaysLogo extends PureComponent {
  render() {
    return (
      <img alt={ I18n.t('application.peerplays_logo_title') } src={ PoweredByPPLogoPath }
        width={ 130 } height={ 22 }></img>
    )
  }
}
export default PeerPlaysLogo;
