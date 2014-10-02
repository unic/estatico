'use strict';

/**
 * Generate main.js, head.js
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	path = require('path'),
	merge = require('merge-stream'),
	packages = {
		main: {
			src: './source/assets/js/main.js',
			dest: './build/assets/js'
		},
		head: {
			src: './source/assets/js/head.js',
			dest: './build/assets/js'
		}
	};

gulp.task('js:default', function() {
	var tasks = _.map(packages, function(config) {
			var fileName = path.basename(config.src);

			return gulp.src(config.src)
				.pipe(plumber())
				.pipe(resolveDependencies({
					pattern: /\* @requires [\s-]*(.*?\.js)/g,
					log: true
				}).on('error', errorHandler))
				.pipe(concat(fileName))
				.pipe(gulp.dest(config.dest))
				.pipe(util.env.dev ? util.noop() : uglify({
					preserveComments: 'some'
				}))
				.pipe(size({
					title: 'js:default',
					showFiles: true
				}))
				.pipe(util.env.dev ? util.noop() : rename({
					suffix: '.min'
				}))
				.pipe(util.env.dev ? util.noop() : gulp.dest(config.dest))
				.pipe(livereload({
					auto: false
				}));
		});

	return merge(tasks);
});
