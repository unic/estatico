'use strict';

/**
 * Generate customized lodash build in source/assets/.tmp/
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

gulp.task('js:lodash', function(cb) {
	var cmdDir = 'node_modules/.bin/',
		targetDir = 'source/assets/.tmp/',
		targetFile = 'lodash.js',
		relTargetPath = path.relative(cmdDir, targetDir + targetFile),
		modules = ['debounce', 'keys', 'bind'],
		args = [
			'include=' + modules.join(','),
			'-o',
			relTargetPath,
			'-d'
		];

	// Create source/assets/.tmp directory if not already present
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, function(err) {
			if (err) {
				errorHandler(err);
			}
		});
	}

	exec('cd ' + cmdDir + ' && .' + path.sep + 'lodash ' + args.join(' '), cb);
});
