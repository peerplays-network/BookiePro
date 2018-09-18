import React, {PureComponent} from 'react';
import 'react-table/react-table.css';
import {BackingBettingWidget} from '../';

class BackingWidgetContainer extends PureComponent {
  render() {

    let eventFlag = false;

    if (this.props.marketData.length) {
      eventFlag = true;
    }
    
    return (
      <div className='backingWidgetContainer'>
        <div className='title'>{this.props.widgetTitle}</div>

        { !eventFlag && 
          <BackingBettingWidget
            marketData={ this.props.marketData }
            title={ this.props.widgetTitle }
            eventStatus={ this.props.eventStatus }
            isLiveMarket={ true }
          />
        }

        { eventFlag && this.props.marketData.map((market, index) => {
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
      </div>
    );
  }
}

export default BackingWidgetContainer;
