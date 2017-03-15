import React from 'react';
import './Sport.less';

// Sport Objects (1.A.x)
// Sports are defined as Blockchain objects so that we can use their Graphene object IDs as identifiers, say,
//  when we request events of a type of Sport.
//  Each Sport object contains the list of object Ids of all underlying event groups.
const Sport = React.createClass({
  render() {
    return (
      <div className='sport-node-container'
        key={ this.props.id }
        onClick={ this.props.onClick  } >
        { this.props.data.isSelected ?
          <div className='sport-label-container-selected'>
            <label> { this.props.name } </label>
          </div>
          :
          <div className='sport-label-container'>
            <label> { this.props.name } </label>
          </div>
         }
      </div>
    );
  }
});

export default Sport;
