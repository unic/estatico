'use strict';

/**
 * Generate head.js
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

gulp.task('js:head', function() {
	return gulp.src([
			'./source/assets/js/head.js'
		])
		.pipe(plumber())
		.pipe(resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}).on('error', errorHandler))
		.pipe(concat('head.js'))
		.pipe(util.env.prod ? uglify({
			preserveComments: 'some'
		}) : util.noop())
		.pipe(size({
			title: 'js:head'
		}))
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(livereload({
			auto: false
		}));
});
