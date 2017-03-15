import React from 'react';
import { Loc } from '../../store/localize';
import translateIt from '../../store/translator'

const Localize = () => (
  <div id='home-wrapper'>
    <p>
      {/*use the Loc tag to translate the key, note: this will return translated value with span tag around it*/}
      <Loc locKey='key_1'/><br/>
      <Loc locKey='key_2'/>
    </p>
    <div>
      {/*This is how we will translate the word, this code returns exact translation without any tag around it*/}
      {translateIt('key_1')}
      {/*pass the default value, in case the key is not present page will display the default value*/}
      {translateIt('key_3','default value goes here')}
    </div>
  </div>
);

export default Localize;
