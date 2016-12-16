'use strict';

/**
 * @function `gulp css:lint`
 * @desc Lint CSS files (using `Stylelint`).
 */

var gulp = require('gulp');

var taskName = 'css:lint',
	taskConfig = {
		src: [
			'./source/assets/css/**/*.scss',
			'./source/modules/**/*.scss',
			'./source/demo/modules/**/*.scss',
			'./source/preview/**/*.scss',
			'!./source/modules/.scaffold/scaffold.scss',
			'!./source/assets/css/templates/*.scss'
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		path = require('path'),
		util = require('gulp-util'),
		cached = require('gulp-cached'),
		stylelint = require('gulp-stylelint');

	return gulp.src(taskConfig.src, {
		dot: true
	})
		.pipe(cached('linting'))
		.pipe(stylelint({
			reporters: [{
				formatter: 'string',
				console: true
			}, {
				formatter: function(results) {
					results.filter(function(result) {
						return result.errored;
					}).forEach(function(result) {
						helpers.errors({
							task: taskName,
							message: 'Linting error in file "' + path.relative('./source/', result.source) + '" (details above)'
						});
					});
				}
			}],
			failAfterError: !util.env.dev
		}))
		.on('error', helpers.errors);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
