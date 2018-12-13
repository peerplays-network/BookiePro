import React from 'react';
import ChainTypes from '../Utility/ChainTypes';

class InnerTest extends React.Component {

    static propTypes = {
      asset: ChainTypes.ChainAsset.isRequired,
    };

    componentWillMount() {}

    render() {
      console.log(this.props.asset, 'assetassetasset');
      return (
        <div className='main'>
          InnerTest {this.props.testVar} {this.props.accountId}
        </div>
      );
    }
}


export default InnerTest;