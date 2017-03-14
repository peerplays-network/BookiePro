import React, { Component } from 'react';
import './Event.less';

//Event Objects (1.C.x)
//Event objects represent sports games and they are created by Blockchain witnesses.
//  we can directly store competitors data within an event.
class Event extends Component {

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
      <div className='event-node-container'
        key={ this.props.key }
        onClick={ this.props.onClick  } >
          <div className='event-label-container'>
            <label> { this.props.name } </label>
          </div>
      </div>
    );
  }
}

export default Event;
