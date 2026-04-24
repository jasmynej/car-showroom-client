import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder required by react-router-dom in Jest environment
const util = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = util.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = util.TextDecoder;
}
