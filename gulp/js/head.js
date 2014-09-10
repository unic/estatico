'use strict';

/**
 * Generate head.js
 */

var gulp = require('gulp'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	util = require('gulp-util'),
	uglify = require('gulp-uglify'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload');

gulp.task('js:head', function () {
	return gulp.src([
			'./source/assets/js/head.js'
		])
		.pipe(resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true,
			fail: util.env.develop ? false : true
		}))
		.pipe(concat('head.js'))
		.pipe(util.env.production ? uglify({
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
