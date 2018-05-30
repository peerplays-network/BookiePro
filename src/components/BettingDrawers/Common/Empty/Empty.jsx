import React from 'react';
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
      
    </div>
  );
}

export default Empty;
