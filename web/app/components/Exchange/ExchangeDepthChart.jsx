import React from 'react';
import {connect} from 'react-redux';
import HighstockThemeService from 'services/HighstockThemeService';
import utils from 'common/utils';
import counterpart from 'counterpart';
import asset_utils from 'common/asset_utils';
let Highstock = require('highcharts/highstock.src');

require('highcharts/modules/exporting')(Highstock);

// Apply the theme
Highstock.setOptions(HighstockThemeService.getTheme());

class ExchangeDepthChart extends React.Component {
  componentWillReceiveProps(nextProps) {
    let {
      bids,
      asks,
      settlementPrice,
      power,
      baseAssetSymbol,
      quoteAssetSymbol,
      baseAssetPrecision,
      quoteAssetPrecision
    } = nextProps;

    let config = {
      colors: [
        'rgba(0,254,149,.44)', 'rgba(47,152,232,.88)'
      ],
      chart: {
        type: 'area',
        alignTicks: false,
        margin: [
          60, 0, 35, 0
        ],
        animation: false
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        tickWidth: 0,
        labels: {
          formatter: function () {
            return this.value / power;
          }
        },
        crosshair: {
          color: 'rgba(255,255,255,.2)'
        },
        plotLines: []
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          enable: 'false'
        }
      },
      legend: {
        useHTML: true,
        itemStyle: {
          color: '#fff'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        },
        align: 'left',
        verticalAlign: 'top',
        y: 10,
        symbolHeight: 24,
        symbolWidth: 24
      },
      tooltip: {
        useHTML: true,
        backgroundColor: '#fff',
        borderColor: '#e1e1e1',
        borderRadius: 0,
        headerFormat: '',
        formatter: function () {
          return (
            `<span class="text">${counterpart.translate('exchange.price')}:  </span>
            <span class="num">
              ${utils.format_number(this.x / power, baseAssetPrecision)} ${baseAssetSymbol}
            </span>
            <br>
            <span class="text">${counterpart.translate('exchange.quantity')}:  </span>
            <span class="num">
              ${utils.format_number(this.y, quoteAssetPrecision)} ${quoteAssetSymbol}
            </span>`
          );
        }
      },
      series: []
    };

    let min,
      max;

    if (bids.length > 0 || asks.length > 0) {
      min = this.getMinValue(bids, asks);
      max = this.getMaxValue(bids, asks);
    }

    if (bids.length > 0) {
      bids.unshift([-1, bids[0][1]]);
    }

    if (asks.length > 0) {
      asks.push([
        asks[asks.length - 1][0] * 2,
        asks[asks.length - 1][1]
      ]);
    }

    if (!this.chart) {
      config
        .series
        .push({
          color: 'rgba(0,254,149,.44)',
          fillColor: 'rgba(0,254,149,.44)',
          step: 'right',
          name: `Bid ${quoteAssetSymbol}`,
          data: bids
        }, {
          color: 'rgba(47,152,232,0.88)',
          fillColor: 'rgba(47,152,232,0.88)',
          step: 'left',
          name: `Ask ${quoteAssetSymbol}`,
          data: asks
        });

      if (settlementPrice) {
        config
          .xAxis
          .plotLines
          .push({
            color: '#eeeeee',
            id: 'plot_line',
            dashStyle: 'solid',
            value: settlementPrice,
            label: {
              text: counterpart.translate('explorer.block.settlement_price'),
              style: {
                color: '#DADADA'
              }
            },
            width: 2,
            zIndex: 5
          });
      }

      if (bids.length > 0 && asks.length > 0) {
        config.xAxis.min = min;
        config.xAxis.max = max;
      }

      this.chart = Highstock.chart('chart02', config);

    } else {

      this.chart.xAxis[0].removePlotLine('plot_line');
      this.chart.xAxis[0].addPlotLine({
        color: '#eeeeee',
        id: 'plot_line',
        dashStyle: 'solid',
        value: settlementPrice,
        label: {
          text: counterpart.translate('explorer.block.settlement_price'),
          style: {
            color: '#DADADA'
          }
        },
        width: 2,
        zIndex: 5
      });

      if (bids.length > 0 || asks.length > 0) {
        this.chart.xAxis[0].setExtremes(min, max, false);
        this.chart.xAxis[0].update({
          min: min,
          max: max,
          labels: {
            formatter: function () {
              return this.value / power;
            }
          }
        }, false);
      }

      this.chart.series[0].setData(bids, false);
      this.chart.series[1].setData(asks, false);
      this.chart.redraw();
    }

    this.chart.tooltip.options.formatter = function () {
      return (
        `<span class="text">${counterpart.translate('exchange.price')}:  </span>
        <span class="num">
          ${utils.format_number(this.x / power, baseAssetPrecision)} ${baseAssetSymbol}
        </span>
        <br>
        <span class="text">${counterpart.translate('exchange.quantity')}:  </span>
        <span class="num">
          ${utils.format_number(this.y, quoteAssetPrecision)} ${quoteAssetSymbol}
        </span>`
      );
    };

  }

  getMinValue(bids, asks) {
    if (bids.length && asks.length) {
      let middleValue = this.getMiddleValue(bids, asks);
      return middleValue * 0.4;
    } else if (bids.length) {
      return 0;
    } else if (asks.length) {
      return 0;
    }

  }
  getMaxValue(bids, asks) {
    if (bids.length && asks.length) {
      let middleValue = this.getMiddleValue(bids, asks);
      return middleValue * 1.6;
    } else if (bids.length) {
      return bids[bids.length - 1][0] * 1.1;
    } else if (asks.length) {
      return asks[0][0] * 1.6;
    }
  }

  getMiddleValue(bids, asks) {
    return (asks[0][0] + bids[bids.length - 1][0]) / 2;
  }

  render() {
    let {
      totalBids,
      totalAsks,
      baseAssetPrecision,
      quoteAssetPrecision,
      baseAssetSymbol,
      quoteAssetSymbol
    } = this.props;

    return (
      <div className='ex-chart ex-chart-02'>
        <div className='section'>
          <div className='section__title'>
            MARKET DEPTH {utils.format_number(totalBids, baseAssetPrecision)}
            {baseAssetSymbol}
            / {utils.format_number(totalAsks, quoteAssetPrecision)}
            {quoteAssetSymbol}
          </div>
          <div id='chart02' className='ex_chartArea'></div>
        </div>
      </div>
    );
  }
}

ExchangeDepthChart = connect((state) => {
  return {
    bids: state.exchangePageReducer.bids,
    asks: state.exchangePageReducer.asks,
    totalAsks: state.exchangePageReducer.totalAsks,
    totalBids: state.exchangePageReducer.totalBids,
    settlementPrice: state.exchangePageReducer.settlementPrice,
    power: state.exchangePageReducer.power,
    baseAssetPrecision: state.exchangePageReducer.baseAssetPrecision,
    quoteAssetPrecision: state.exchangePageReducer.quoteAssetPrecision,
    baseAssetSymbol: asset_utils.getSymbol(state.exchangePageReducer.baseAssetSymbol),
    quoteAssetSymbol: asset_utils.getSymbol(state.exchangePageReducer.quoteAssetSymbol)
  };
})(ExchangeDepthChart);

export default ExchangeDepthChart;