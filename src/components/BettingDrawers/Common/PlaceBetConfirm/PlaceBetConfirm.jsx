import React from 'react';
import { Button }  from 'antd';
import { I18n, Translate } from 'react-redux-i18n';

const PERFECT = 'perfect';
const IMPERFECT = 'imperfect';

const renderInstructions = (className, goodBets, badBets, amount) => {
  let instructions = '';
  if (badBets > 0) {
    instructions =
      <span>
        <Translate
          value={ `${ className }.bad_bets` }
          bad_bets={ badBets }
          count={ badBets }
          dangerousHTML/>
        <br/>
        <Translate
          value={ `${ className }.good_bets` }
          good_bets={ goodBets }
          count={ goodBets }
          dangerousHTML/>
      </span>
  } else {
    instructions =
      <Translate
        value={ `${ className }.good_bets` }
        good_bets={ goodBets }
        count={ goodBets }
        dangerousHTML/>
  }

  return instructions;
}

const PlaceBetConfirm = (props) => {
  const { className, cancelAction, confirmAction, goodBets, badBets, amount, currencySymbol } = props;
  const extendedClassName = `${ className }.${badBets === 0 ? PERFECT : IMPERFECT}`;
  return (
    <div className='overlay'>
      <div className='instructions'>
        { renderInstructions(extendedClassName, goodBets, badBets) }
        { currencySymbol }
        { amount }        
        <p>{ I18n.t(`${extendedClassName}.are_you_sure`)}</p>
      </div>
      <div className='buttons'>
        <Button className='btn btn-cancel' onClick={ cancelAction }>
          { I18n.t(`${ extendedClassName }.cancel_button`) }
        </Button>
        <Button className='btn btn-regular' onClick={ confirmAction }>
          { I18n.t(`${ extendedClassName }.confirm_button`) }
        </Button>
      </div>
    </div>
  )
}

export default PlaceBetConfirm;
