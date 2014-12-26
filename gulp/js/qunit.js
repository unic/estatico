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
			// Ignore files without a QUnit script reference
			if (file.contents.toString().search('assets/vendor/qunit/qunit/qunit.js') === -1) {
				ignoreFiles.push(file.path);

				return;
			}

			// Fix absolute file paths
			file.contents = new Buffer(file.contents.toString().replace('<head>', '<head><base href="/' + path.resolve('./build') + '/">').replace(/\"\//g, '"'));
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