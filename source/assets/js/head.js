'use strict';

require('../.tmp/modernizr.js');

// Set up global namespace
window.estatico = require('./helpers/namespace.js');

// Init font loader
require('./helpers/fontloader.js').init();
