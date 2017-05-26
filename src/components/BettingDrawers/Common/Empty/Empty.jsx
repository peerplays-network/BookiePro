import React from 'react';
import { Button } from 'antd';
import { I18n, Translate } from 'react-redux-i18n';

const Empty = (props) => {
  const { className, showSuccess } = props;
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
        <Button className='btn btn-regular' onClick={ () => props.navigateTo('/my-wager/') }>
          { I18n.t('quick_bet_drawer.unconfirmed_bets.empty.my_bet_button') }
        </Button>
      </div>
    </div>
  );
}

export default Empty;
