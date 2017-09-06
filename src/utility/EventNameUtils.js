import React from 'react';

/**
 * Take an event name and return JSX component that displays the event name
 * in 2 rows with line break right after the word `vs`.
 * The JSX component returned is wrapped in a <span> element.
 *
 * If the event name does not contains `vs`, it will be returned as a JSX component too.
 * But the name will be unchanged.
 *
 * @param {string} name - event name to be formatted
 * @returns {object} - JSX component displaying event name either formatted or not
 */
const breakAtVs = (name) => {
  let formatted = (<span>{ name }</span>);
  // REVIEW Ensure this is the actual agreed format
  const found = name.match(/^(.*)(\W+vs\W+)(.*)$/);
  if (found !== null) {
    formatted = (<span>{ found[1] }{ found[2] }<br/>{ found[3] }</span>);
  }
  return formatted;
}

const EventNameUtils = {
  breakAtVs
};

export default EventNameUtils;
