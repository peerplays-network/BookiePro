import React, { Component } from 'react';
import './EventGroup.less';

// EventGroup Objects (1.B.x)
// An EventGroup is a collective term we use to describe the following concepts commonly found in sports:
// League (or similarly, Conference and Division, e.g. NFL, NCAA, Premier League...)
// Tournament (e.g. FA Cup, World Cup...)
// The main purpose of having EventGroups is to group events under their respective leagues/tournament at the application side bar.
class EventGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };

  }
  componentDidMount() {
    // console.log( this.props.key + " " + this.props.name );
    // console.log( JSON.stringify( this.props.data));

  }

  render() {
    return (
      <div className='eventgroup-node-container'
        key={ this.props.key }
        onClick={ this.props.onClick  } >
        <label> { this.props.name } </label>
      </div>
    );
  }
}

export default EventGroup;
