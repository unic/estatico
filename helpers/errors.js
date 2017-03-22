'use strict';

var util = require('gulp-util'),
	notifier = require('node-notifier');

module.exports = function(err) {
	var plugin = err.task || err.plugin, // run-sequence exposes a different error object
		message = err.err || err.message, // run-sequence exposes a different error object
		stack = err.stack;

	// Show errors as OS notifictions
	// Working with --dev flag only
	notifier.notify({
		title: plugin,
		message: message
	});

	// Fallback for stack trace
	if (!stack && err.fileName && err.lineNumber) {
		stack = {
			file: err.fileName,
			line: err.lineNumber
		};
	}

	// Log detailed error to console
	util.log(plugin, util.colors.red(message), stack || '');

	// Do not exit if --dev flag is used (helpful when watching files)
	if (!util.env.dev) {
		process.exit(1);
	}
};
