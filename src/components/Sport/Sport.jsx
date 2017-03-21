import React, { Component } from 'react';
import { connect } from 'react-redux';
import Banner from './Banner';
import { SportPageActions } from '../../actions';

const { getData } = SportPageActions;

class Sport extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.ObjectId));
  }

  render() {
    return (
      <div className='sport-wrapper'>
        <Banner sport={ this.props.sport }/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { sport } = state;
  const sportObject = sport.sports.find((obj) => obj.id === ownProps.params.objectId);
  let sportName = '';
  if (sportObject !== undefined) {
    sportName = sportObject.name;
  }

  return {
    sport: sportName
  };
}

export default connect(mapStateToProps)(Sport);
