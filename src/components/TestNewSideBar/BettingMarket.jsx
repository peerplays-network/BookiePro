import React, { Component } from 'react';
import './BettingMarket.less';

//BettingMarket Object (1.E.x)
//A betting market is a market where bettors can bet on a single specific outcome for an event
class BettingMarket extends Component {

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
      <div className='betting-market-leaf-container'
        key={ this.props.key }
        onClick={ this.props.onClick  } >
        <label> { this.props.name } </label>
      </div>
    );
  }
}

export default BettingMarket;
