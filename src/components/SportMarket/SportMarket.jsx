import React,  {  Component  }  from 'react';
import Banner from '../MarketScreen/Banner';
import MarketTable from '../MarketTable';

class SportMarket extends Component {

  render() {
    return (

      <div>
        { this.props.location.pathname }
        <Banner />
        <MarketTable />
      </div>
    );
  }
}

export default SportMarket;
