//unused
import React, {Component} from 'react';
import {connect} from 'react-redux';

class CalcBlockTimeWrapper extends Component {
  calc_block_time(block_number) {
    const state = this.context.store.getState();
    const block_interval = state.chain.block_interval;
    const head_block = state.chain.head_block_number;
    const head_block_time = new Date(state.chain.time);
    const seconds_below = (head_block - block_number) * block_interval;
    return new Date(head_block_time - seconds_below * 1000);
  }

  componentWillReceiveProps(next_props) {
    if (next_props.block_number !== this.props.block_number) {
      return true;
    }

    return false;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.block_number !== this.props.block_number;
  }

  render() {
    return (
      <span className='wrapper' key={ this.props.block_number }>
        {
          this.props.children({
            head_block_number: this.props.head_block_number,
            block_number: this.props.block_number,
            time: this.calc_block_time(this.props.block_number)
          })
        }
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {head_block_number: state.chain.head_block_number};
}


CalcBlockTimeWrapper.contextTypes = {store: React.PropTypes.object};
CalcBlockTimeWrapper.propTypes = {
  children: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps)(CalcBlockTimeWrapper);