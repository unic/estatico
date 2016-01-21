'use strict';

/**
 * @function `gulp scaffold:delete`
 * @desc Remove module or page and delete references in `main.scss` and `main.js`.
 *
 * * Prompts for type and name of element to be deleted.
 * * Non-interactive mode: `gulp scaffold:delete --interactive=false --type={Module|Page|Demo Module|Demo Page} --name=bla`
 */

var gulp = require('gulp'),
	defaultTask = require('./default');

var taskName = 'scaffold:delete',
	taskConfig = {
		// Extends the default task's config
		types: {
			demoModule: {
				allowRecursiveDelete: true
			},
			demoPage: {
				allowRecursiveDelete: true
			}
		},
		scaffold: {
			name: null,
			src: null,
			deregisterStyles: false,
			deregisterScript: false
		}
	},
	getTaskScaffoldConfig = function(config, cb) {
		var _ = require('lodash');

		var helpers = require('require-dir')('../../helpers'),
			scaffoldConfig = {};

		// Get custom config and pass to task
		helpers.scaffold.getType(config.types, {
				prompt: 'What do you want to delete?'
			})
			.then(function(response) {
				if (response.hasAssets) {
					scaffoldConfig.deregisterStyles = true;
					scaffoldConfig.deregisterScript = true;
				}

				return helpers.scaffold.getTarget(response.dest, response.allowRecursiveDelete);
			})
			.then(function(response) {
				if (_.isArray(response)) {
					scaffoldConfig.name = _.pluck(response, 'name');
					scaffoldConfig.src = _.pluck(response, 'src');
				} else {
					scaffoldConfig.name = response.name;
					scaffoldConfig.src = response.src;
				}

				cb(scaffoldConfig);
			})
			.catch(helpers.errors);
	},

	task = function(config, cb) {
		var del = require('del'),
			_ = require('lodash'),
			helpers = require('require-dir')('../../helpers'),
			livereload = require('gulp-livereload'),
			tap = require('gulp-tap'),
			path = require('path'),
			merge = require('merge-stream');

		if (!config.scaffold.src) {
			helpers.errors({
				task: taskName,
				message: 'Nothing to delete'
			});

			return cb();
		}

		del(config.scaffold.src, function() {
			var srcs = _.isArray(config.scaffold.src) ? config.scaffold.src.map(function(src, i) {
					return path.join(src, config.scaffold.name[i]);
				}) : [path.join(config.scaffold.src, config.scaffold.name)],
				tasks = [],
				deregisterStyles,
				deregisterScript;

			if (config.scaffold.deregisterStyles) {
				deregisterStyles = gulp.src(config.registerStyles.src)
					.pipe(tap(function(file) {
						srcs.forEach(function(src) {
							file.contents = helpers.scaffold.removeModule(file, src, config.registerStyles);
						});
					}))
					.pipe(gulp.dest(path.dirname(config.registerStyles.src)))
					.pipe(livereload());

				tasks.push(deregisterStyles);
			}

			if (config.scaffold.deregisterScript) {
				deregisterScript = gulp.src(config.registerScript.src)
					.pipe(tap(function(file) {
						srcs.forEach(function(src) {
							file.contents = helpers.scaffold.removeModule(file, src, config.registerScript);
						});
					}))
					.pipe(gulp.dest(path.dirname(config.registerScript.src)))
					.pipe(livereload());

				tasks.push(deregisterScript);
			}

			if (tasks.length > 0) {
				merge(tasks).on('finish', cb);
			} else {
				cb();
			}
		});
	};

gulp.task(taskName, function(cb) {
	var _ = require('lodash');

	// Extend default task's config
	var config = _.merge({}, defaultTask.taskConfig, taskConfig);

	getTaskScaffoldConfig(config, function(scaffoldConfig) {
		config = _.merge(config, {
			scaffold: scaffoldConfig
		});

		task(config, cb);
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task,
	getTaskScaffoldConfig: getTaskScaffoldConfig
};
