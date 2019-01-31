import React from 'react';
import classNames from 'classnames';
import asset_utils from 'common/asset_utils';

class DropDownTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBuyInMenu: false
    };

    this.hideBuyIn = this.hideBuyIn.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.hideBuyIn, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideBuyIn, false);
  }

  toggleBuyIn(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (this.state.showBuyInMenu) {
      this.hideBuyIn();
    } else {
      this.showBuyIn(e);
    }
  }

  hideBuyIn() {
    this.setState({showBuyInMenu: false});
  }

  showBuyIn() {
    this.setState({showBuyInMenu: true});
  }

  setAssetSymbol(unitId, e) {
    e.preventDefault();

    if (this.props.setAssetSymbol) {
      this.props.setAssetSymbol(unitId);
    }
  }

  render() {
    let {triggerClass, items} = this.props;

    return (
      <div className={ classNames(triggerClass, {open: this.state.showBuyInMenu}) }>
        <a href='' className='ddTrigger' onClick={ this.toggleBuyIn.bind(this) }> {/* eslint-disable-line */}
          <span className='ddTrigger__text'></span>
          <span className='ddTrigger__icon icon-str_close'></span>
        </a>
        <div className='ddMenu'>
          <ul className='ddMenu__list'>
            {items.map((item) => {
              return (
                <li key={ item.get('id') } className='ddMenu__item'>
                  <a href='#' className='ddMenu__link active' onClick={ this.setAssetSymbol.bind(this, item.get('id')) }> {/* eslint-disable-line */}
                    {asset_utils.getSymbol(item.get('symbol'))}
                  </a>
                </li>
              );
            })}

            <li className='ddMenu__item'>
              <a href='#' className='ddMenu__link active' onClick={ this.setAssetSymbol.bind(this, 'any') }> {/* eslint-disable-line */}
                ANY
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default DropDownTrigger;