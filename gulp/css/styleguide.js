'use strict';

/**
 * Compile Sass to CSS
 * Run autoprefixer on the generated CSS
 */

var gulp = require('gulp'),
	rubySass = require('gulp-ruby-sass'),
	util = require('gulp-util'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	size = require('gulp-size'),
	tinylr = require('tiny-lr'),
	server = tinylr();

gulp.task('css:styleguide', function () {
	return gulp.src([
		'./source/styleguide/*.scss'
	])
		.pipe(rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: util.env.production ? 'compressed' : 'expanded',
			fullException: true
		}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(size({
			title: 'css'
		}))
		.pipe(gulp.dest('./build/styleguide'))
		.pipe(livereload(server));
});
