import React from 'react';
import {connect} from 'react-redux';
import {RSettingsActions} from '../../../actions';
import classNames from 'classnames';
import asset_utils from 'common/asset_utils';
import {bindActionCreators} from 'redux';

class UnitSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: false
    };
  }

  _closePopup() {
    if (this.state.popup) {
      this.setState({popup: false});
    }
  }

  componentWillMount() {
    document.addEventListener('click', this._closePopup.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._closePopup.bind(this), false);
  }

  openPopup(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.setState({
      popup: !this.state.popup
    });
  }

  changeUnit(value) {
    this.props.changeUnit(value);

    if (this.props.onHandleChange) {
      this.props.onHandleChange(value);
    }
  }

  _renderList(value, index) {
    let {unit} = this.props;
    return (
      <li
        className='ddMenu__item'
        key={ index }
        onClick={ this.changeUnit.bind(this, value) }
      >
        <a className={ classNames('ddMenu__link', 'js-sel_dropDown', {'active': (unit == value)}) }> { /* eslint-disable-line */ }
          {asset_utils.getSymbol(value)}
        </a>
      </li>
    );
  }

  render() {
    let showPopup = this.state.popup, {unitList} = this.props;
    let list = [];

    unitList.forEach((value, index) => {
      list.push(this._renderList(value, index));
    });

    return (
      <div className={ classNames('aside__balanceUnit', 'dd', {'open': showPopup}) }>
        <a onClick={this.openPopup.bind(this)} className='aside__balanceUnitText ddTrigger js_dropDown'> { /* eslint-disable-line */ }
          <span className='ddTrigger__text'>Preferred Unit</span>
        </a>
        <div className='ddMenu'>
          <ul className='ddMenu__list'>
            {list}
          </ul>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    unit: state.settings.unit,
    unitList: state.settings.defaults.unit
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    changeUnit: RSettingsActions.changeUnit
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(UnitSelect);