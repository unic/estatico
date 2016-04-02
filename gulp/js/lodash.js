'use strict';

/**
 * @function `gulp js:lodash`
 * @desc Generate customized lodash build.
 */

var gulp = require('gulp');

var taskName = 'js:lodash',
	taskConfig = {
		file: 'lodash.js',
		dest: 'source/assets/.tmp/'
	};

gulp.task(taskName, function(cb) {
	var build = require('lodash-cli'),
		helpers = require('require-dir')('../../helpers'),
		size = require('gulp-size'),

		// uglify = require('gulp-uglify'),
		file = require('gulp-file'),
		util = require('util');

	var modules = ['debounce', 'uniqueId'],
		args = [
			'include=' + modules.join(','),
			'-d'
		];

	build(args, function(data) {
		if (util.isError(data)) {
			helpers.errors({
				task: taskName,
				message: data.message
			});
		}

		file(taskConfig.file, data.source, {
			src: true
		})
			.pipe(size({
				title: taskName,
				showFiles: true
			}))

			// // Test minified size
			// .pipe(uglify({
			// 	preserveComments: 'some'
			// }))
			// .pipe(size({
			// 	title: taskName + ' (minified)',
			// 	showFiles: true
			// }))
			.pipe(gulp.dest(taskConfig.dest))
			.on('end', cb);
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
