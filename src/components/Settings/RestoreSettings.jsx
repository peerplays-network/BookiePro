import React from 'react';
import counterpart from 'counterpart';

export default class RestoreSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedType: 0,
      types: ['backup', 'key', 'legacy']
    };
  }

  _changeType(e) {
    this.setState({
      selectedType: this.state.types.indexOf(e.target.value)
    });
  }

  render() {
    let {types, selectedType} = this.state;
    let options = types.map((type) => {
      return (
        <option
          key={ type }
          value={ type }>
          {counterpart.translate(`settings.backup_${type}`)}
        </option>
      );
    });
    let content;

    switch (types[selectedType]) {
      case 'backup':
        break;
      case 'key':
        break;
      default:
    }

    return (
      <div>
        <select
          value={ types[selectedType] }
          onChange={ this._changeType.bind(this) }
          className='bts-select'
        >
          {options}
        </select>
        {content}
      </div>
    );
  }
};
