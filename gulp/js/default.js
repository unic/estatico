'use strict';

/**
 * Generate main.js, head.js
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	tap = require('gulp-tap'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	fs = require('fs'),
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
	},
	// Get first 3 lines of LICENSE.txt to inject into license.js
	license = (function() {
		try {
			var content = fs.readFileSync('./LICENSE.txt').toString(),
				lines = content.split("\n").slice(0, 3),
				license = lines.map(function(line) {
					return "\n" + ' * ' + line;
				}).join('');

			return license + "\n";
		} catch (err) {
			helpers.errors({
				task: 'js:default',
				message: 'Error reading "'+ path.relative('./source/', file) +'": ' + err
			});
		}
	})();

gulp.task('js:default', function() {
	var tasks = _.map(packages, function(config) {
			var fileName = path.basename(config.src);

			return gulp.src(config.src)
				.pipe(plumber())
				.pipe(resolveDependencies({
					pattern: /\* @requires [\s-]*(.*\.js)/g,
					log: true
				}).on('error', helpers.errors))
				.pipe(tap(function(file) {
					if (path.basename(file.path) === 'license.js') {
						file.contents = new Buffer(file.contents.toString().replace('[LICENSE]', license));
					}
				}))
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
