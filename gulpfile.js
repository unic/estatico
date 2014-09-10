'use strict';

// Load handlebars helpers
require('./handlebars');

// Load tasks
require('require-dir')('./gulp', {
	recurse: true
});
