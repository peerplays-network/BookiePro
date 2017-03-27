import React,  {  Component  }  from 'react';
import MarketTable from '../MarketTable';

class SportMarket extends Component {

  render() {
    return (

      <div>
        { this.props.location.pathname }
        <MarketTable />
      </div>
    );
  }
}

export default SportMarket;
