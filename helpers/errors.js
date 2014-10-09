'use strict';

var util = require('gulp-util'),
	notifier = require('node-notifier');

module.exports = function(err) {
	var plugin = err.task || err.plugin, // run-sequence exposes a different error object
		message = err.err || err.message, // run-sequence exposes a different error object
		optional = (err.fileName && err.lineNumber) ? {
			file: err.fileName,
			line: err.lineNumber
		} : '';

	// Show errors as OS notifictions
	// Working with --dev flag only
	notifier.notify({
		title: plugin,
		message: message
	});

	util.log(plugin, util.colors.red(message), optional);

	// Do not exit if --dev flag is used (helpful when watching files)
	if (!util.env.dev) {
		process.exit(1);
	}
};
