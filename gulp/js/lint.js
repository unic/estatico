'use strict';

/**
 * @function `gulp js:lint`
 * @desc Lint JavaScript files (using `JSHint`).
 */

var gulp = require('gulp');

var taskName = 'js:lint',
	taskConfig = {
		src: [

			// './gulp/**/*.js',
			// './helpers/**/*.js',
			// './test/**/*.js',
			// '!./test/**/expected/**/*.js',
			'./source/assets/js/**/*.js',
			'./source/modules/**/*.js',
			'./source/pages/**/*.js',
			'./source/demo/modules/**/*.js',

			// './source/demo/modules/!**!/!*.jsx',
			'./source/demo/pages/**/*.js',
			'!./source/modules/.scaffold/scaffold.js'
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		tap = require('gulp-tap'),
		path = require('path'),
		cached = require('gulp-cached'),
		eslint = require('gulp-eslint');

	return gulp.src(taskConfig.src, {
		dot: true
	})
		.pipe(cached('linting'))
		.pipe(eslint())
		.pipe(eslint.formatEach())
		.pipe(tap(function(file) {
			if (file.eslint && file.eslint.errorCount > 0) {
				helpers.errors({
					task: taskName,
					message: 'Linting error in file "' + path.relative('./source/', file.path) + '" (details above)'
				});
			}
		}));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
