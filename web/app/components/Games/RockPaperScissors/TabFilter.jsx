import React from 'react';

class TabFilter extends React.Component {
  changeTournamentType(type) {
    this.props.changeTournamentType(type);
  }

  render() {
    let {tournamentsFilter} = this.props;
    return (
      <div className='tab__deployHead'>
        <div className='pG__radioWrap'>
          <label className='customRadio__label pG__radioItem'>
            <span className='customRadio__labelRelative'>
              <input
                type='radio'
                className='customRadio__check '
                name='name1'
                checked={ tournamentsFilter === 'open' }
                onChange={ this.changeTournamentType.bind(this, 'open') }/>
              <span className='customRadio__checkPseudo'></span>
            </span>
            <span className='customRadio__labelPseudo'>Find an Open Tournament</span>
          </label>
          <label className='customRadio__label pG__radioItem'>
            <span className='customRadio__labelRelative'>
              <input
                type='radio'
                className='customRadio__check '
                name='name1'
                checked={ tournamentsFilter === 'all' }
                onChange={ this.changeTournamentType.bind(this, 'all') }/>
              <span className='customRadio__checkPseudo'></span>
            </span>
            <span className='customRadio__labelPseudo'>Explore All Tournaments</span>
          </label>
        </div>
      </div>
    );
  }
}

export default TabFilter;