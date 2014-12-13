'use strict';

/**
 * Generate customized Modernizr build in source/assets/.tmp/
 * Using Customizr, crawl through project files and gather up references to Modernizr tests
 *
 * See https://github.com/doctyper/customizr
 */

var gulp = require('gulp'),
	util = require('gulp-util'),
	modernizr = require('gulp-modernizr'),
	tap = require('gulp-tap'),
	uglify = require('gulp-uglify');

gulp.task('js:modernizr', function() {
	return gulp.src([
			'./source/assets/css/*.scss',
			'./source/modules/**/*.scss',
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(modernizr())
		.pipe(tap(function(file) {
			var content = file.contents.toString();

			// Remove bang from test comments to allow for removal on uglifying
			content = content.replace(/\/\*\!\n{/g, '/*\n{').replace(/\!\*\//g, '*/');

			file.contents = new Buffer(content);
		}))
		.pipe(util.env.prod ? uglify() : util.noop())
		.pipe(gulp.dest('./source/assets/.tmp'));
});
