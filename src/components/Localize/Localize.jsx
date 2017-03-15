import React from 'react';

var I18n = require('react-redux-i18n').I18n;

const Localize = () => (
  <div id='home-wrapper'>
    <div>
      {I18n.t('application.title')}<br/>  {/* => returns 'Toffe app met i18n!' for locale 'nl'*/}
      {I18n.t('export', {count: 1})}<br/> {/* => returns 'Niks te exporteren' for locale 'nl'*/}
      {I18n.t('application.weird_key')}<br/> {/* => returns 'Weird key' as translation is missing*/}
      {I18n.t('application.hello', {name: 'Aad'})}<br/> {/* => returns 'Hallo, Aad!' for locale 'nl'*/}
      {I18n.l(1385856000000, { dateFormat: 'date.long' })}<br/> {/* => returns '1 december 2013' for locale 'nl'*/}
      {I18n.l(Math.PI, { maximumFractionDigits: 2 })}<br/> {/* => returns '3,14' for locale 'nl'*/}
    </div>
  </div>
);

export default Localize;
