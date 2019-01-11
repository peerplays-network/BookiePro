import React from 'react';
import Highcharts from 'highcharts';
import {connect} from 'react-redux';
import counterpart from 'counterpart';

class TimeChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.graphBlockTimes.length < 19) {
      return false;
    } else if (this.props.graphBlockTimes.length === 0) {
      return true;
    }

    if (this.chart) {
      let series = this.chart.series[0];
      let finalValue = series.xData[series.xData.length - 1];

      if (series.xData.length) {
        let needRedraw = false;
        nextProps
          .graphBlockTimes
          .forEach((point) => {
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
      nextProps.graphBlockTimes[nextProps.graphBlockTimes.length - 1]['id'] !==
        this.props.graphBlockTimes[this.props.graphBlockTimes.length - 1]['id'] ||
        nextProps.graphBlockTimes.length !== this.props.graphBlockTimes.length);
  }
  componentDidMount() {
    let tooltipLabel = counterpart.translate('explore.blockchain.block_time');
    this.chart = new Highcharts['Chart']('chart01', {
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
        pointFormat: '<span class="text">' +
          tooltipLabel + '</span>: <span class="num">{point.y} s</span>'
      },
      series: []
    });

    if (this.props.graphBlockTimes.length) {
      if (!this.chart.series[0]) {
        this.chart.addSeries({name: 'Time', colorByPoint: true, borderWidth: 0, data: []});

        this.props.graphBlockTimes.forEach((point) => {
          this.chart.series[0].addPoint(point, false, false);
        });

        this.chart.redraw();
      }
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  render() {
    return (
      <div className='chart chart01' id='chart01'></div>
    );
  }
}

TimeChart = connect((state) => {
  return {graphBlockTimes: state.explorerBlockchainPage.graphBlockTimes};
})(TimeChart);

export default TimeChart;