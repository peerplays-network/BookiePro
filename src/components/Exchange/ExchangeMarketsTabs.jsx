import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import utils from 'common/utils';
import {ExchangePageActions, NavigateActions} from '../../actions';
import Translate from 'react-translate-component';
import AssetName from '../Explorer/BlockChain/AssetName';
import asset_utils from 'common/asset_utils';
import {bindActionCreators} from 'redux';

class ExchangeMarketsTabs extends React.Component {
  constructor() {
    super();
    this.state = {
      searchMarket: ''
    };

    this.inited = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.inited && nextProps.baseAssetSymbol) {
      this.inited = true;
      nextProps.tabs.find((tab, idx) => {
        if (nextProps.baseAssetSymbol === tab.name) {
          if (nextProps.currentTab !== idx) {
            this.props.setMarketTab(idx);
          }
        }

        return null;
      });
    }
  }

  _onSearchChange(e) {
    this.setState({searchMarket: e.target.value});
  }

  onSetMarketTab(nextTab, e) {
    if (this.props.currentTab !== nextTab) {
      this.props.setMarketTab(nextTab);
    }

    e.preventDefault();
  }

  onChangeSort(type) {
    this.props.changeExchangeMarketsRowsSort(type);
  }

  onNavigateTo(id) {
    this.props.navigateToExchangeMarket(id);
  }

  render() {
    let {searchMarket} = this.state, {
        tabs,
        currentTab,
        marketRowsData,
        marketRowsDataSortBy,
        marketRowsDataSortInvert,
        marketRowsDataLoaderIsShow
      } = this.props,
      marketsRows = null,
      tabsRows = tabs.map((tab, idx) => {

        return (
          <div key={ tab.prefix + tab.name } className='table__tabItem'>
            <a href='' onClick={ this.onSetMarketTab.bind(this, idx) } className={ classNames('table__tabLink', {'active': currentTab === idx}) }> { /* eslint-disable-line */}
              <AssetName asset={ tab }/>\
            </a>
          </div>
        );
      });

    if (!marketRowsDataLoaderIsShow) {
      marketRowsData = marketRowsData.sort((a, b) => {
        switch (marketRowsDataSortBy) {
          case 'volume':
            if (marketRowsDataSortInvert) {
              return b.volumeBase - a.volumeBase;
            } else {
              return a.volumeBase - b.volumeBase;
            }

          case 'change':
            if (marketRowsDataSortInvert) {
              return b.change - a.change;
            } else {
              return a.change - b.change;
            }

          case 'price':
            if (marketRowsDataSortInvert) {
              return b.price - a.price;
            } else {
              return a.price - b.price;
            }

          case 'name':
            let aName = (a.assetName.prefix + a.assetName.name).toLowerCase(),
              bName = (b.assetName.prefix + b.assetName.name).toLowerCase();

            if (aName > bName) {
              return marketRowsDataSortInvert
                ? -1
                : 1;
            } else if (aName < bName) {
              return marketRowsDataSortInvert
                ? 1
                : -1;
            } else {
              return 0;
            }

          default: return null;
        }
      });

      marketsRows = marketRowsData.filter((row) => {
        return (
          searchMarket === '' || (asset_utils
            .getSymbol(row.assetName.name)
            .toLowerCase())
            .indexOf(searchMarket.toLowerCase()) !== -1
        );
      }).map((row) => {
        return (
          <div
            key={ row.id }
            className='tableRow'
            onClick={ this.onNavigateTo.bind(this, row.id) }>
            <div className='tableCell'>
              <span className='ex_tablePic__wrap'>
                <img src='images/star.png' className='ex_tablePic' alt=''/>
              </span>
              <b className=''><AssetName asset={ row.assetName }/></b>
            </div>
            <div className='tableCell text_r'>{utils.format_volume(row.volumeBase)}</div>
            <div className='tableCell text_r'>{row.priceText}</div>
            <div className='tableCell text_r'>{row.change}%</div>
          </div>
        );
      });
    }

    return (
      <div className='ex-markets'>
        <section className='section'>
          <div className='section__title'>
            <div className='section__titleText'><Translate content='markets.title'/></div>
            <div className='section__titleSearch'>
              <input
                type='text'
                autoComplete='off'
                placeholder='Search'
                value={ searchMarket }
                onChange={ this._onSearchChange.bind(this) }
                className='field-type4'/>
            </div>
          </div>
          <div className='section__table'>
            <div className='table table3 table-sm'>
              <div className='table__tab'>
                {tabsRows}
              </div>
              <div className='table__head tableRow'>
                <div
                  className='tableCell pointer '
                  onClick={ this.onChangeSort.bind(this, 'name') }>MARKETS
                </div>
                <div
                  className='tableCell text_r pointer'
                  onClick={ this.onChangeSort.bind(this, 'volume') }
                >
                  VOLUME
                </div>
                <div
                  className='tableCell text_r pointer'
                  onClick={ this.onChangeSort.bind(this, 'price') }
                >
                  PRICE
                </div>
                <div
                  className='tableCell text_r pointer'
                  onClick={ this.onChangeSort.bind(this, 'change') }
                >
                  CHANGE
                </div>
              </div>
              <div className='table__body'>
                {
                  (marketRowsDataLoaderIsShow)
                    ? <div className='loader-splash'>
                      <span className='loader loader-s'/>
                    </div>
                    : marketsRows
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseAssetSymbol: state.exchangePageReducer.baseAssetSymbol,
    currentTab: state.exchangePageReducer.currentTab,
    tabs: state.exchangePageReducer.tabs,
    marketRowsData: state.exchangePageReducer.marketRowsData,
    marketRowsDataSortBy: state.exchangePageReducer.marketRowsDataSortBy,
    marketRowsDataSortInvert: state.exchangePageReducer.marketRowsDataSortInvert,
    marketRowsDataLoaderIsShow: state.exchangePageReducer.marketRowsDataLoaderIsShow
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setMarketTab: ExchangePageActions.setMarketTab,
    changeExchangeMarketsRowsSort: ExchangePageActions.changeExchangeMarketsRowsSort,
    navigateToExchangeMarket: NavigateActions.navigateToExchangeMarket
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeMarketsTabs);