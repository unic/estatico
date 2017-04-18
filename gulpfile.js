'use strict';

var validatenv = require('validate-node-version')(),
	errors = require('./helpers/errors.js'),
	util = require('gulp-util');

// Check Node Version
// To skip this check use the flag: `gulp --ignoreNodeVersion`
if (!validatenv.satisfies && !util.env.ignoreNodeVersion) {
	errors({
		plugin: 'gulpfile.js',
		message: validatenv.message + '. To skip this check use the following flag: `gulp --ignoreNodeVersion`'
	});
}

// Load tasks
require('require-dir')('./gulp', {
	recurse: true
});
