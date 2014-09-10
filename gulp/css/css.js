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
	size = require('gulp-size');

gulp.task('css', function () {
	return gulp.src([,
			'./source/assets/css/*.scss',
			'./source/styleguide/assets/css/*.scss'
		], {
			base: './source/'
		})
		.pipe(rubySass({
			loadPath: [
				'source/assets/css',
				'source/assets/vendor',
				'source/modules'
			],
			style: util.env.production ? 'compressed' : 'expanded',
			fullException: true
		}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(size({
			title: 'css',
			showFiles: true
		}))
		.pipe(gulp.dest('./build'))
		.pipe(livereload({
			auto:false
		}));
});
