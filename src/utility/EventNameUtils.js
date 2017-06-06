import React from 'react';

/*
 * Take an event name and return JSX component that displays the event name
 * in 2 rows with line break right after the word `vs`.
 * The JSX component returned is wrapped in a <span> element.
 *
 * If the event name does not contains `vs`, it will be returned as a JSX component too.
 * But the name will be unchanged.
 */
const breakAtVs = (name) => {
  let formatted = (<span>{ name }</span>);
  // REVIEW Ensure this is the actual agreed format
  if (name.includes('vs')) {
    const index = name.indexOf('vs');
    formatted = (<span>{ name.substring(0, index+3) }<br/>{ name.substring(index+3) }</span>);
  }
  return formatted;
}

const EventNameUtils = {
  breakAtVs
};

export default EventNameUtils;
