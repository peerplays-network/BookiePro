import React from 'react';
import { Button }  from 'antd';
import { I18n, Translate } from 'react-redux-i18n';

const renderInstructions = (className, replacements) => {
  const instructions = <Translate value={ `${ className }.instructions` } dangerousHTML/>;
  if (replacements) {
    return React.cloneElement(instructions, replacements);
  }

  return instructions;
}

const Overlay = (props) => {
  const { className, cancelAction, confirmAction, replacements } = props;
  return (
    <div className='overlay'>
      <div className='instructions'>
        { renderInstructions(className, replacements) }
      </div>
      <div className='buttons'>
        <Button className='btn btn-cancel' onClick={ cancelAction }>
          { I18n.t(`${ className }.cancel_button`) }
        </Button>
        <Button className='btn btn-regular' onClick={ confirmAction }>
          { I18n.t(`${ className }.confirm_button`) }
        </Button>
      </div>
    </div>
  )
}

export default Overlay;
