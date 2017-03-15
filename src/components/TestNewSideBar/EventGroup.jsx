import React from 'react';
import './EventGroup.less';

// EventGroup Objects (1.B.x)
// An EventGroup is a collective term we use to describe the following concepts commonly found in sports:
// League (or similarly, Conference and Division, e.g. NFL, NCAA, Premier League...)
// Tournament (e.g. FA Cup, World Cup...)
// The main purpose of having EventGroups is to group events under their respective leagues/tournament at the application side bar.
const EventGroup = React.createClass({
  render() {
    return (
      <div className='eventgroup-node-container'
        key={ this.props.id }
        onClick={ this.props.onClick  } >
        { this.props.data.isSelected ?
          <div className='eventgroup-label-container-selected'>
            <label> { this.props.name } </label>
          </div>
          :
          <div className='eventgroup-label-container'>
            <label> { this.props.name } </label>
          </div>
         }
      </div>
    );
  }
});

export default EventGroup;
