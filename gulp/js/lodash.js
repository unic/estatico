'use strict';

/**
 * Generate customized lodash build in source/assets/.tmp/
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

gulp.task('js:lodash', function(cb) {
	var cmdDir = 'node_modules/.bin/',
		targetDir = 'source/assets/.tmp/',
		absTargetDir = path.resolve(targetDir),
		targetFile = 'lodash.js',
		absTargetFile = path.resolve(targetDir + targetFile),
		modules = ['debounce', 'keys', 'bind', 'each', 'filter'],
		args = [
			'include=' + modules.join(','),
			'-o',
			'"' + absTargetFile + '"',
			'-d'
		];

	// Create source/assets/.tmp directory if not already present
	if (!fs.existsSync(absTargetDir)) {
		fs.mkdirSync(absTargetDir, function(err) {
			if (err) {
				helpers.errors(err);
			}
		});
	}

	exec('cd ' + cmdDir + ' && .' + path.sep + 'lodash ' + args.join(' '), cb);
});
