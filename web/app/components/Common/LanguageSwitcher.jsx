import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {switchLocale} from 'actions/RSettingsActions';

@connect((state) => {
  return {
    defaultLocales: state.settings.defaults.locale,
    locale: state.settings.locale
  };
}, {switchLocale})
class LanguageSwitcher extends React.Component {
  onSwitchLocale(lang, e) {
    this.props.switchLocale(lang);
    e.preventDefault();
  }

  getItems() {
    return (
      this.props.defaultLocales.map((lang) => {
        let flag;

        switch (lang) {
          case 'en':
            flag = 'us';
            break;
          default:
            flag = lang;
        }

        return (
          <li
            key={ flag }
            className={ classNames('lang__item us', {
              active: this.props.locale === lang
            }) }>
            <a
              onClick={ this.onSwitchLocale.bind(this, lang) }
              href={ '#language/' + lang }
              className='lang__link'><img src={ `images/flags/${flag}.png` } alt=''/>
            </a>
          </li>
        );
      })
    );
  }

  render() {
    return null; //TODO::uncomment
    return (
      <div className='lang__wrap'>
        <ul className='lang__list'>
          {this.getItems()}
        </ul>
      </div>
    );
  }
}

export default LanguageSwitcher;