import React from 'react';
import { Button } from 'antd';
import { I18n, Translate } from 'react-redux-i18n';

const Empty = (props) => {
  const { className, showSuccess } = props;
  const buttonText = showSuccess ? I18n.t(`${className}.success.my_bet_button`) :
                     I18n.t(`${className}.empty.my_bet_button`);
  return (
    <div className='empty'>
      <div className='instructions'>
        { showSuccess &&
           I18n.t(`${className}.success.instructions`)
        }
        { !showSuccess &&
          <Translate value={ `${className}.empty.instructions` } dangerousHTML/>
        }
      </div>
      <div className='my-bet-button'>
        <Button className={ `btn btn-regular ${showSuccess ? 'go-to-bets-btn' : '' }` } onClick={ () => props.navigateTo('/my-wager/') }>
          { buttonText }
        </Button>
      </div>
    </div>
  );
}

export default Empty;
