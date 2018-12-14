import {addLocaleData} from 'react-intl';

import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import ko from 'react-intl/locale-data/ko';
import zh from 'react-intl/locale-data/zh';
import de from 'react-intl/locale-data/de';
import tr from 'react-intl/locale-data/tr';

var counterpart = require('counterpart-instance');
var locale_en = require('json!assets/locales/locale-en'); // eslint-disable-line
// var ls = require('common/localStorage');
// let ss = new ls('__peerplays__');

counterpart.registerTranslations('en', locale_en);
counterpart.setFallbackLocale('en');

addLocaleData(en);
addLocaleData(es);
addLocaleData(fr);
addLocaleData(ko);
addLocaleData(zh);
addLocaleData(de);
addLocaleData(tr);

let localesObject = {en: locale_en};

/**
 * Set locale library
 * @param locale
 * @param localeData
 */
export function switchLibraryLocale({locale, localeData}) {
  switch (locale) {
    case 'en':
      counterpart.registerTranslations('en', localesObject.en);
      break;
    default:
      counterpart.registerTranslations(locale, localeData);
      break;
  }

  counterpart.setLocale(locale);
}