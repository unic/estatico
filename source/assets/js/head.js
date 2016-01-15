'use strict';

require('../.tmp/modernizr.js');

var namespace = require('./helpers/namespace.js'),
	fontLoader = require('./helpers/fontloader.js');

// Set up global namespace
window.estatico = namespace;

// Init font loader
fontLoader.init();
