import React, {PureComponent} from 'react';
import {I18n} from 'react-redux-i18n';
import depositIcon from '../../../assets/icons/onboard_deposit_icon.png';
import registerIcon from '../../../assets/icons/onboard_register_icon.png';
import betIcon from '../../../assets/icons/onboard_bet_icon.png';

const LandingStepTypes = {
  REGISTER: 'REGISTER',
  DEPOSIT: 'DEPOSIT',
  BET: 'BET'
};

class LandingSteps extends PureComponent {
  constructor(props) {
    super(props);

    this.renderStep = this.renderStep.bind(this);
  }

  renderStep(landingStepType) {
    let iconSource, title, message;

    switch (landingStepType) {
      case LandingStepTypes.REGISTER: {
        iconSource = registerIcon;
        title = I18n.t('landing.registerStepTitle');
        message = I18n.t('landing.registerStepMessage');
        break;
      }

      case LandingStepTypes.DEPOSIT: {
        iconSource = depositIcon;
        title = I18n.t('landing.depositStepTitle');
        message = I18n.t('landing.depositStepMessage');
        break;
      }

      case LandingStepTypes.BET: {
        iconSource = betIcon;
        title = I18n.t('landing.betStepTitle');
        message = I18n.t('landing.betStepMessage');
        break;
      }

      default:
        break;
    }

    return (
      <div className='step'>
        <div className='icon-container'>
          <img className='icon' src={ iconSource } alt={ landingStepType } />
        </div>
        <div className='content'>
          <div className='title'>{title}</div>
          <div className='message'>{message}</div>
        </div>
      </div>
    );
  }

  render() {
    const {className} = this.props;
    return (
      <div className={ className + ' landing-steps' }>
        {this.renderStep(LandingStepTypes.REGISTER)}
        {this.props.depositsEnabled ? (
          <div>
            <div className='separator' />
            {this.renderStep(LandingStepTypes.DEPOSIT)}
          </div>
        ) : null}
        <div className='separator' />
        {this.renderStep(LandingStepTypes.BET)}
      </div>
    );
  }
}

export default LandingSteps;
