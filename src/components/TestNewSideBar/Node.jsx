import React, { Component } from 'react';
import './Node.less';


class Node extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };

  }
  componentDidMount() {
    console.log( this.props.key + " " + this.props.name );
    console.log( JSON.stringify( this.props.data));

  }

    render() {
        return (
          <div className='simple-node-container' key={ this.props.key }
            onClick= { this.props.onClick  } >
            <label> { this.props.name } </label>
          </div>
        );
    }
}

export default Node;
