'use strict';

var gulp = require('gulp'),
	fs = require('fs'),
	exec = require('child_process').exec;

/**
 * Generate customized lodash build in source/assets/.tmp/
 */
gulp.task('lodash', function(cb) {
	var modules = ['debounce'],
		args = [
			'include=' + modules.join(','),
			'-o',
			'source/assets/.tmp/lodash.js',
			'-d'
		];

	exec('node_modules/.bin/lodash ' + args.join(' '), cb);
});


/**
 * Generate customized lodash build in source/assets/.tmp/
 *//*
gulp.task('lodash', function(cb) {
	var cmdDir = 'node_modules/.bin/',
		targetDir = 'source/assets/.tmp/',
		targetFile = 'lodash.js',
		relTargetPath = path.relative(cmdDir, targetDir + targetFile),
		modules = ['debounce'],
		args = ['include=' + modules.join(','), '-o',
		relTargetPath, '-d'];

	// Create source/assets/.tmp directory if not already present
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, function(err) {
			if (err) {
				console.log(err);
			}
		});
	}

	exec('cd ' + cmdDir + ' && .' + path.sep + 'lodash ' + args.join(' '), cb);
});
*/
