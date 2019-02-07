import React from 'react';
import classNames from 'classnames';

class Pagination extends React.Component {
  renderDots(itemKey) {
    return (
      <li key={ itemKey } className='pagination__li'>
        <span className='pagination__dots'>...</span>
      </li>
    );
  }

  navigateTo (page, e) {
    if (this.props.navigateTo) {
      this.props.navigateTo(page);
    }

    e.preventDefault();
  }
  renderInternalLink(page, isActive = false) {
    return (
      <li key={ page } className='pagination__li' onClick={ this.navigateTo.bind(this, page) }>
        <a href='#' className={ classNames('pagination__item', {active: isActive}) }> {/* eslint-disable-line */}
          {page}
        </a>
      </li>
    );
  }

  render() {
    let {currentPage, countPages, offset} = this.props;

    if (countPages < 2) {
      return null;
    }

    let firstPage = 1;
    let lastNumPage = countPages;
    let buttons = [];

    /**
   * First page
   */
    buttons.push(this.renderInternalLink(firstPage, currentPage === firstPage));

    /**
   * Dots
   */

    if (currentPage - 1 - offset > 2) {
      buttons.push(this.renderDots('dots_first'));
    }

    /**
   * Internal pages
   */
    let from;
    let to;

    if (currentPage - 1 - offset <= 2) {
      from = 2;
    } else {
      from = currentPage - offset;
    }

    if ((currentPage + offset) >= countPages - 2) {
      to = countPages - 1;
    } else {
      to = currentPage + offset;
    }

    for (let i = from; i <= to; ++i) {
      buttons.push(this.renderInternalLink(i, currentPage === i));
    }

    /**
   * Dots
   */
    if (currentPage + offset < countPages - 2) {
      buttons.push(this.renderDots('dots_last'));
    }

    /**
   * Last page
   */
    buttons.push(this.renderInternalLink(lastNumPage, currentPage === lastNumPage));

    return (
      <div className='pagination'>
        <ul className='pagination__list'>
          {buttons}
        </ul>
      </div>
    );
  }
}

export default Pagination;