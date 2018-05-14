/**
 * This component is used to create the peerplays logo image.
 * It is used in the following components:
 *   {@link AllSports}
 *   {@link BettingMarketGroup}
 *   {@link ChangePassword}
 *   {@link EventGroup}
 *   {@link HelpAndSupport}
 *   {@link MyAccount}
 *   {@link MyWager}
 *   {@link Sport}
 */
import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PoweredByPPLogoPath from '../../assets/images/powerbypp.png';
import "./PeerPlaysLogo.less"

class PeerPlaysLogo extends PureComponent {
  render() {
    return (
      <div className='peerplays-logo'>
        <img alt={ I18n.t('application.peerplays_logo_title') } src={ PoweredByPPLogoPath }
          width={ 130 } height={ 22 }></img>
      </div>
    )
  }
}
export default PeerPlaysLogo;
