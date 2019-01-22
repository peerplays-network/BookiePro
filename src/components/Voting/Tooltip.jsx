import React from 'react';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      isOpen: false
    };
  }

  onClick() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    return (
      <a onClick={ this.onClick.bind(this) }> { /* eslint-disable-line */}
        <span className='tooltip__wrap'>
          <span className='tooltip__trigger icon-help tooltip-def'></span>
          {
            this.state.isOpen
              ? <span className='tooltip__menu'>
                <span className='tooltip__menuIcon icon-help'>
                </span>
                {this.state.text}
              </span>
              : false
          }
        </span>
      </a>
    );
  }
}

export default Tooltip;
