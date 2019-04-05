import React, {PureComponent} from 'react';
import 'react-table/react-table.css';
import {BackingBettingWidget} from '../';

class BackingWidgetContainer extends PureComponent {
  render() {

    let eventFlag = false;

    if (this.props.marketData.size > 0) {
      eventFlag = true;
    }
    
    return (
      <div className='backingWidgetContainer'>
        <div className='title'>{this.props.widgetTitle}</div>

{ !eventFlag && this.props.marketData.length > 0 && this.props.marketData.map((market, index) => { // eslint-disable-line
          return (<BackingBettingWidget
            key={ index }
            title={ market.get('eventName') }
            eventID={ market.get('eventID') }
            eventTime={ market.get('eventTime') }
            eventStatus={ market.get('eventStatus') }
            columnType={ market.get('description') }
            marketData={ market }
            isLiveMarket={ true }
          />);
        })}

        { eventFlag && this.props.marketData.size > 0 && // eslint-disable-line
          (<BackingBettingWidget
            key={ this.props.marketData.get('id') }
            title={ this.props.eventName }
            eventID={ this.props.marketData.get('event_id') }
            eventTime={ this.props.eventTime }
            eventStatus={ this.props.marketData.get('status') }
            eventRoute={ this.props.eventRoute }
            columnType={ this.props.marketData.get('description') }
            marketData={ this.props.marketData }
            isLiveMarket={ true }
          />)
        }
      </div>
    );
  }
}

export default BackingWidgetContainer;
