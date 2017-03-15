import React,  {  Component  }  from 'react';
import Banner from '../MarketScreen/Banner';
import MarketTable from '../MarketTable';

class SportMarket extends Component {

  componentDidMount() {
    // console.log( this.props.params.objectId)

    //http://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs
    if ( this.props.location.pathname.split("/").length === 4){
      // console.log(  this.props.location.pathname.split("/").length )
      //
      // console.log(  this.props.location.pathname.split("/") )
    }



  }

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
