'use strict';

/**
 * Required tasks for unittesting.
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	path = require('path'),
	_ = require('lodash'),
	tap = require('gulp-tap'),
	ignore = require('gulp-ignore'),
	qunit = require('gulp-qunit'),
	qunit = require('gulp-qunit'),
	del = require('del');

/**
 * Copy QUnit test files
 */
gulp.task('qunit:copy', function() {
	return gulp.src([
			'./source/assets/vendor/qunit/qunit/*',
			'./source/modules/**/*.test.js'
		], {
			base: './source/'
		})
		.pipe(gulp.dest('./build/test/'));
});

/**
 * Run QUnit tests
 */
gulp.task('qunit:test', ['qunit:copy'], function(cb) {
	var ignoreFiles = [];

	gulp.src('./build/{pages/,modules/**/}*.html')
		.pipe(tap(function(file) {
			var content = file.contents.toString();

			// Ignore files without a QUnit script reference
			if (content.search('assets/vendor/qunit/qunit/qunit.js') === -1) {
				ignoreFiles.push(file.path);

				return;
			}

			// Fix absolute file paths
			content = content.replace('<head>', '<head><base href="/' + path.resolve('./build') + '/">').replace(/\"\//g, '"');

			// Re-enable autostart
			content = content.replace('QUnit.config.autostart = false;', '');

			file.contents = new Buffer(content);
		}))
		.pipe(ignore.exclude(function(file) {
			return _.indexOf(ignoreFiles, file.path) !== -1;
		}))
		// Move them outside /build/ for some weird phantomJS reason
		.pipe(gulp.dest('./.qunit/'))
		.pipe(qunit().on('error', helpers.errors))
		.on('finish', function() {
			// Remove .qunit tmp folder
			del('./.qunit/');

			cb();
		});
});
