// Set up file for Jest test.
// It is triggered in the setupFiles option in package.json

import {jsdom} from 'jsdom';

// Create DOM object for testing
const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
global.document = jsdom(documentHTML);
global.window = document.defaultView;
global.navigator = global.window.navigator;

// Stub matchMedia for the headless browser
// Ref: https://github.com/WickyNilliams/enquire.js/issues/82
global.window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};

// Work around for https://github.com/WickyNilliams/enquire.js/issues/161
global.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
