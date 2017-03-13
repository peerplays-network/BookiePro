import React, { Component } from 'react';
import './Sport.less';

// Sport Objects (1.A.x)
// Sports are defined as Blockchain objects so that we can use their Graphene object IDs as identifiers, say,
//  when we request events of a type of Sport.
//  Each Sport object contains the list of object Ids of all underlying event groups.
class Sport extends Component {

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
      <div className='sport-node-container'
        key={ this.props.key }
        onClick={ this.props.onClick  } >
        <label> { this.props.name } </label>
      </div>
    );
  }
}

export default Sport;
