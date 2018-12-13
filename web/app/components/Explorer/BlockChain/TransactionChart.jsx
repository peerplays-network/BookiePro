import React from 'react';
import Highcharts from 'highcharts';
import {connect} from 'react-redux';
import counterpart from 'counterpart';

class TransactionChart extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.graphBlockTransactions.length < 19) {
      return false;
    } else if (this.props.graphBlockTransactions.length === 0) {
      return true;
    }

    if (this.chart) {
      let series = this.chart.series[0];
      let finalValue = series.xData[series.xData.length - 1];

      if (series.xData.length) {
        let needRedraw = false;

        nextProps.graphBlockTransactions.forEach((point) => {
          if (point['id'] > finalValue) {
            needRedraw = true;
            series.addPoint(point, false, series.xData.length >= 20);
          }
        });

        if (needRedraw) {
          this.chart.redraw();
        }

        return false;
      }
    }

    return (
      nextProps.graphBlockTransactions[nextProps.graphBlockTransactions.length - 1]['id'] !==
        this.props.graphBlockTransactions[this.props.graphBlockTransactions.length - 1]['id'] ||
        nextProps.graphBlockTransactions.length !== this.props.graphBlockTransactions.length);
  }
  componentDidMount() {
    let tooltipLabel = counterpart.translate('explore.blockchain.transactions');
    this.chart = new Highcharts['Chart']('chart02', {
      chart: {
        backgroundColor: 'transparent',
        type: 'column',
        height: 230,
        margin: [0, 0, 0, 0]
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
        gridLineWidth: 0,
        minorTickLength: 0,
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        lineColor: '#0f3748',
        lineWidth: 2,
        tickWidth: 0
      },
      yAxis: {
        type: 'datetime',
        gridLineWidth: 0,
        minorTickLength: 0,
        tickLength: 0,

        min: 0,
        minRange: 0.1,
        labels: {
          enabled: false
        },
        title: {
          text: null
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 2,
          minPointLength: 5,
          dataLabels: {
            enabled: false
          }
        }
      },
      tooltip: {
        useHTML: true,
        backgroundColor: '#fff',
        borderColor: '#e1e1e1',
        borderRadius: 0,
        headerFormat: '',
        pointFormat: '<span class="text">' + tooltipLabel +
          '</span>: <span class="num">{point.y}</span><br /><span class="text">Block</span>' +
            ': <span class="num">{point.x}</span>'
      },
      series: []
    });

    if (this.props.graphBlockTransactions.length) {
      if (!this.chart.series[0]) {
        this.chart.addSeries({name: 'Transactions', colorByPoint: true, borderWidth: 0, data: []});

        this.props.graphBlockTransactions.forEach((point) => {
          this.chart.series[0].addPoint(point, false, false);
        });

        this.chart.redraw();
      }
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div className='chart chart02' id='chart02'></div>
    );
  }
}

TransactionChart = connect((state) => {
  return {graphBlockTransactions: state.explorerBlockchainPage.graphBlockTransactions};
})(TransactionChart);

export default TransactionChart;