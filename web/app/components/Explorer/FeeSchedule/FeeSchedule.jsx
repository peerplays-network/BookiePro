import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import Table from './Table';

@connect((state) => {
  return {feeGroups: state.exploreFeeSchedule.feeGroups};
})
class FeeSchedule extends React.Component {
  render() {
    let {feeGroups} = this.props;
    let tables = [];

    for (let groupName in feeGroups) {
      let fees = feeGroups[groupName];

      if (fees.group.length && fees.group[0]) {
        tables.push(<Table title={ fees.title } rows={ fees.group } key={ groupName }/>);
      }
    }

    return (
      <div
        id='feeSchedule'
        className='tab__deploy'
        style={ {
          display: 'block'
        } }>
        <div className='tab__deployHead'>
          <div className='title col'><Translate content='explore.feeSchedule.title'/></div>
        </div>
        <div className='box-inner box-inner-2'>
          {tables}
        </div>
      </div>
    );
  }
}

export default FeeSchedule;