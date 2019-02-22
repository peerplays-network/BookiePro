import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import Select from 'react-select';
import {RSettingsActions} from '../../actions';
import {bindActionCreators} from 'redux';

class GeneralSettings extends React.Component {
  onSwitchLocale(e) {
    this.props.switchLocale(e.value);
  }

  onChangeSettleStatus() {
    this.props.changeSettleStatus();
  }

  onChangeChatStatus() {
    this.props.changeChatStatus();
  }

  render() {
    let localeOptions = this.props.defaultLocales.map((entry) => {
      return {value: entry, label: counterpart.translate('languages.' + entry)};
    });

    let {locale} = this.props;

    return (
      <div id='general' className='tab__deploy general__tab block'>
        <div className='tab__deployHead'>
          <div className='title'><Translate content='settings.general' /></div>
          <div className='desc'><Translate content='settings.general_text' /></div>
        </div>
        <div className='box-inner box-inner-2'>
          <form className='clearfix'>
            <div className='col col-4 col-offset-05'>
              <div className='row2'>
                <label className='label'><Translate content='settings.locale' /></label>
                <Select
                  value={ locale }
                  options={ localeOptions }
                  onChange={ this.onSwitchLocale.bind(this) }
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    locale: store.settings.locale,
    defaultLocales: store.settings.defaults.locale,
    showSettles: store.settings.showSettles,
    defaultShowSettles: store.pageSettings.defaults.showSettles,
    disableChat: store.settings.disableChat,
    defaultDisableChat: store.pageSettings.defaults.disableChat
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    switchLocale: RSettingsActions.switchLocale,
    changeSettleStatus: RSettingsActions.changeSettleStatus,
    changeChatStatus: RSettingsActions.changeChatStatus
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);