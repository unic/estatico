'use strict';

/**
 * Compile Sass to CSS
 * Run autoprefixer on the generated CSS
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	rubySass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minify = require('gulp-minify-css'),
	rename = require('gulp-rename');

gulp.task('css', function() {
	return gulp.src([
			'./source/assets/css/*.scss',
			'./source/styleguide/assets/css/*.scss'
		], {
			base: './source/'
		})
		.pipe(plumber())
		.pipe(rubySass({
			loadPath: [
				'source/assets/css',
				'source/assets/vendor',
				'source/modules'
			],
			style: 'compact',
			lineNumbers: true
		}).on('error', errorHandler))
		.pipe(autoprefixer('last 2 version').on('error', errorHandler))
		.pipe(gulp.dest('./build/'))
		.pipe(util.env.dev ? util.noop() : minify())
		.pipe(util.env.dev ? util.noop() : rename({
			suffix: '.min'
		}))
		.pipe(size({
			title: 'css',
			showFiles: true
		}))
		.pipe(util.env.dev ? util.noop() : gulp.dest('./build'))
		.pipe(livereload({
			auto: false
		}));
});
