import React from 'react';
import './CommonMessage.less';

const CommonMessage = (props) => {
  const msgClass = 'message-background ' + props.type;
  
  return (
    <div>
      <div className={ msgClass }>
        <div className='message-content'>
          {props.message}
        </div>
      </div>
      <br/>
    </div>
  );
};

export default CommonMessage;
