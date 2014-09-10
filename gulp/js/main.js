'use strict';

var gulp = require('gulp'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	util = require('gulp-util'),
	uglify = require('gulp-uglify'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload');

/**
 * Generate main.js
 */

gulp.task('js:main', function () {
	return gulp.src([
			'./source/assets/js/main.js'
		])
		.pipe(resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true,
			fail: util.env.develop ? false : true
		}))
		.pipe(concat('main.js'))
		.pipe(util.env.production ? uglify({
			preserveComments: 'some'
		}) : util.noop())
		.pipe(size({
			title: 'js:main'
		}))
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(livereload({
			auto: false
		}));
});
