'use strict';

var gulp = require('gulp'),
	rubySass = require('gulp-ruby-sass'),
	util = require('gulp-util'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	tinylr = require('tiny-lr'),
	server = tinylr();

/**
 * Compile Sass to CSS
 * Run autoprefixer on the generated CSS
 */
gulp.task('css', function() {
	return gulp.src(['./source/assets/css/*.scss'])
		.pipe(rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: util.env.production ? 'compressed' : 'expanded',
			fullException: true
		}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(livereload(server));
});

