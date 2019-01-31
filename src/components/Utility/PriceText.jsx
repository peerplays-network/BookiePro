import React from 'react';
import utils from 'common/utils';

class PriceText extends React.Component {
    static propTypes = {
      markedClass: React.PropTypes.string,
      simpleClass: React.PropTypes.string
    };

    static defaultProps = {
      markedClass: 'price-integer',
      simpleClass: 'price-decimal'
    };

    render() {
      let {price, preFormattedPrice, quote, base, markedClass, simpleClass} = this.props;

      let formattedPrice = preFormattedPrice
        ? preFormattedPrice
        : utils.price_to_text(price, quote, base);

      if (formattedPrice.full >= 1) {
        return (
          <span>
            <span className={ markedClass }>{formattedPrice.int}.</span>
            {
              formattedPrice.dec
                ? <span className={ markedClass }>{formattedPrice.dec}</span>
                : null
            }
            {
              formattedPrice.trailing
                ? <span className={ simpleClass }>{formattedPrice.trailing}</span>
                : null
            }
          </span>
        );
      } else if (formattedPrice.full >= 0.1) {
        return (
          <span>
            <span className={ simpleClass }>{formattedPrice.int}.</span>
            {
              formattedPrice.dec
                ? <span className={ markedClass }>{formattedPrice.dec}</span>
                : null
            }
            {
              formattedPrice.trailing
                ? <span className={ simpleClass }>{formattedPrice.trailing}</span>
                : null
            }
          </span>
        );
      } else {
        return (
          <span>
            <span className={ simpleClass }>{formattedPrice.int}.</span>
            {
              formattedPrice.dec
                ? <span className={ simpleClass }>{formattedPrice.dec}</span>
                : null
            }
            {
              formattedPrice.trailing
                ? <span className={ markedClass }>{formattedPrice.trailing}</span>
                : null
            }
          </span>
        );
      }
    }
}

export default PriceText;